### Install Guide

> :bangbang: $\color{red}\textsf{\Large\kern{0.2cm}\ Important this project must have MQTT broker}$

1.  Install/Download NodeJS or Bun
2.  Dowload this project or Clone this project
3.  Install requirement
    - API
      - Go to directory
        ```bash
        cd ../Project/Service/api
        ```
      - Install requirement:
        <br>
        Bun
        ```bash
        bun install
        ```
        NodeJS
        ```bash
        npm i
        ```
        or
        ```bash
        npm install
        ```
    - Line
      - Go to directory
      ```bash
      cd ../Project/Service/line
      ```
      - Install requirement:
        <br>
        Bun
        ```bash
        bun install
        ```
        NodeJS
        ```bash
        npm i
        ```
        or
        ```bash
        npm install
        ```
    - MQTT
      - Go to directory
      ```bash
      cd ../Project/Service/mqtt
      ```
      - Install requirement:
        <br>
        Bun
        ```bash
        bun install
        ```
        NodeJS
        ```bash
        npm i
        ```
        or
        ```bash
        npm install
        ```
    - status
      - Go to directory
      ```bash
      cd ../Project/Service/status
      ```
      - Install requirement:
        <br>
        Bun
        ```bash
        bun install
        ```
        NodeJS
        ```bash
        npm i
        ```
        or
        ```bash
        npm install
        ```
    - Web
      - Go to directory
      ```bash
      cd ../Project/Web
      ```
      - Install requirement:
        <br>
        Bun
        ```bash
        bun install
        ```
        NodeJS
        ```bash
        npm i
        ```
        or
        ```bash
        npm install
        ```
4.  Run service
    - API service 1-4
      > :bangbang: $\color{red}\textsf{\Large\kern{0.2cm}\ Terminal must point API directory}$
      - service 1
        <br>
        Bun
        ```bash
        bun run api1
        ```
        NodeJS
        ```bash
        npm run api1
        ```
      - service 2
        <br>
        Bun
        ```bash
        bun run api2
        ```
        NodeJS
        ```bash
        npm run api2
        ```
      - service 3
        <br>
        Bun
        ```bash
        bun run api3
        ```
        NodeJS
        ```bash
        npm run api3
        ```
      - service 4 (Hardware Only)
        <br>
        Bun
        ```bash
        bun run api4
        ```
        NodeJS
        ```bash
        npm run api4
        ```
    - Line service
      > :bangbang: $\color{red}\textsf{\Large\kern{0.2cm}\ Terminal must point line directory}$
      > Bun
      ```bash
      bun run dev
      ```
      NodeJS
      ```bash
      npm run dev
      ```
    - MQTT service
      > :bangbang: $\color{red}\textsf{\Large\kern{0.2cm}\ Terminal must point mqtt directory}$
      > Bun
      ```bash
      bun run dev
      ```
      NodeJS
      ```bash
      npm run dev
      ```
    - Status service
      > :bangbang: $\color{red}\textsf{\Large\kern{0.2cm}\ Terminal must point status directory}$
      > Bun
      ```bash
      bun run run
      ```
      NodeJS
      ```bash
      npm run run
      ```
