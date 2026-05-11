import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                const host = configService.get<string>('MONGODB_HOST');
                const port = configService.get<string>('MONGODB_PORT');
                const dbName = configService.get<string>('MONGODB_DATABASE');
                return {
                    uri: `mongodb://${host}:${port}/${dbName}`,
                };
            },
            inject: [ConfigService],
        }),
    ],
    exports: [MongooseModule],
})
export class DatabaseModule { }
