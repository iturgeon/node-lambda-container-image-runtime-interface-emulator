## Sample Node Lambda Container Image Project and Dev Env

RIE: a lightweight web-server that converts HTTP requests to JSON events. In other words, use CURL and HTTP to send requests to your Lambda function.

### Install RIE


The setup steps from AWS Lambda Runtime Interface Emulator. Below is the arm64 version, for others see the [RIE install instructions](https://github.com/aws/aws-lambda-runtime-interface-emulator#installing)
```
mkdir -p ~/.aws-lambda-rie && curl -Lo ~/.aws-lambda-rie/aws-lambda-rie https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie-arm64 && chmod +x ~/.aws-lambda-rie/aws-lambda-rie
```

### Build Sample Lambda Node Container Image

```
docker build -t nodelambda:latest .
```

### Start your Node Lambda Container Image

```
docker run -d -v ~/.aws-lambda-rie:/aws-lambda -p 9000:8080 --entrypoint /aws-lambda/aws-lambda-rie nodelambda:latest /usr/local/bin/npx aws-lambda-ric app.handler
```

### Start RIE Container

Start RIE to proxy HTTP requests and convert them to JSON that your Lambda Container understands.

```
docker run --rm --env TARGET_URL=http://localhost:8080 --publish 8080:8080 ghcr.io/eagletmt/aws-lambda-rie-gateway
```

### Send CURL request to RIE proxy

```
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'
```

For reference purposes, here's a sample object that an Application Load Balancer will send to your function
```
{
    "requestContext": {
        "elb": {
            "targetGroupArn": "arn:aws:elasticloadbalancing:us-east-2:123456789012:targetgroup/lambda-279XGJDqGZ5rsrHC2Fjr/49e9d65c45c6791a"
        }
    },
    "httpMethod": "GET",
    "path": "/lambda",
    "queryStringParameters": {
        "query": "1234ABCD"
    },
    "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "accept-encoding": "gzip",
        "accept-language": "en-US,en;q=0.9",
        "connection": "keep-alive",
        "host": "lambda-alb-123578498.us-east-2.elb.amazonaws.com",
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
        "x-amzn-trace-id": "Root=1-5c536348-3d683b8b04734faae651f476",
        "x-forwarded-for": "72.12.164.125",
        "x-forwarded-port": "80",
        "x-forwarded-proto": "http",
        "x-imforwards": "20"
    },
    "body": "",
    "isBase64Encoded": false
}
```

Though you can simplify this object for testing different paths and requests

```
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"httpMethod": "GET", "path": "/justhi"}'
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"httpMethod": "GET", "path": "/mirror", "queryStringParameters":{"query":"value"}}'
```


### Push node lambda application to ECR

```
docker tag nodelambda:latest <AWS_ACCOUNT>.dkr.ecr.<AWS_REGION>.amazonaws.com/<ECR_REPOSITORY>:nodelambda-latest
docker push <AWS_ACCOUNT>.dkr.ecr.<AWS_REGION>.amazonaws.com/<ECR_REPOSITORY>:nodelambda-latest
```


### Start your lambda and connect in to ALB

You can connect your node lambda container image to an application load balancer.  You can use any of the ALB's rules to route requests to your new function, so this could be just one url, or your whole site!

Note, if you attach your Express.js Lambda container image to a specific path, say "/lambda/path", the route in your express application that matches that url would still be `app.get('/lambda/path', () => {})`.  I wasn't initially sure if setting up the ALB this way would send "/" as the path to the function, but that appears to not be the case.


