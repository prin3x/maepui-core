import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { Server } from 'http';
import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as serverless from 'aws-serverless-express';

const bootstrapServer = async (): Promise<Server> => {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);
  app.enableCors();
  await app.init();
  return serverless.createServer(expressApp);
};

let cachedServer: Server;

export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return serverless.proxy(cachedServer, event, context, 'PROMISE').promise;
};