## Sample Node Lambda Container Image Project and Dev Env

RIE: a lightweight web-server that converts HTTP requests to JSON events. In other words, use CURL and HTTP to send requests to your Lambda function.

### Install RIE
The setup steps from AWS Lambda Runtime Interface Emulator:
```
mkdir -p ~/.aws-lambda-rie && curl -Lo ~/.aws-lambda-rie/aws-lambda-rie https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie-arm64 && chmod +x ~/.aws-lambda-rie/aws-lambda-rie
```

### Build Sample Lambda Node Container Image

```
docker build -t nodelambda .
```

### Start your Node Lambda Container Image

```
docker run -d -v ~/.aws-lambda-rie:/aws-lambda -p 9000:8080 --entrypoint /aws-lambda/aws-lambda-rie nodelambda /usr/local/bin/npx aws-lambda-ric app.handler
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
