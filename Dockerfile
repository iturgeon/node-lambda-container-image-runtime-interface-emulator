# Define custom function directory
ARG FUNCTION_DIR="/app"

FROM node:14-alpine3.13 as packages

# Include global arg in this stage of the build
ARG FUNCTION_DIR

# Install aws-lambda-cpp build dependencies
RUN apk add \
    g++ \
    make \
    cmake \
    unzip \
    curl-dev \
    autoconf \
    automake \
    libtool \
    libexecinfo-dev \
    python3

RUN mkdir -p ${FUNCTION_DIR}

WORKDIR ${FUNCTION_DIR}

COPY src/package*.json ${FUNCTION_DIR}

RUN npm install

COPY src/* ${FUNCTION_DIR}

ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]
CMD ["app.handler"]
