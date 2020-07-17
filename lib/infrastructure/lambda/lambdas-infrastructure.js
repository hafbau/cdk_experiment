"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const cdk = __importStar(require("@aws-cdk/core"));
const lambda = __importStar(require("@aws-cdk/aws-lambda"));
const listOfLambdaFunctions = require('./lambdas-list');
class LambdasInfrastructure extends cdk.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.handlers = {};
        const dbUtilLayer = new lambda.LayerVersion(this, 'Db Util Layer', {
            code: lambda.Code.fromAsset(path_1.join(__dirname, '../../../shared_services/dal_dynamodb')),
            compatibleRuntimes: [lambda.Runtime.NODEJS_12_X]
        });
        for (const lambdaName in listOfLambdaFunctions) {
            const { pathFromRoot, handler } = listOfLambdaFunctions[lambdaName];
            this.handlers[lambdaName] = new lambda.Function(this, `${lambdaName}Handler`, {
                runtime: lambda.Runtime.NODEJS_12_X,
                handler: handler || `${lambdaName}.handler`,
                code: lambda.Code.fromAsset(path_1.join(__dirname, '../../../', pathFromRoot)),
                environment: {
                    TABLE_ENTITY: props.table.tableName
                },
                layers: [dbUtilLayer]
            });
            // grant the lambda role read/write permissions to our table
            props.table.grantReadWriteData(this.handlers[lambdaName]);
        }
    }
}
exports.LambdasInfrastructure = LambdasInfrastructure;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhcy1pbmZyYXN0cnVjdHVyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxhbWJkYXMtaW5mcmFzdHJ1Y3R1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsK0JBQTRCO0FBQzVCLG1EQUFxQztBQUNyQyw0REFBOEM7QUFFOUMsTUFBTSxxQkFBcUIsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQU14RCxNQUFhLHFCQUFzQixTQUFRLEdBQUcsQ0FBQyxTQUFTO0lBR3RELFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBVTtRQUN0RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBSEgsYUFBUSxHQUFhLEVBQUUsQ0FBQztRQUt0QyxNQUFNLFdBQVcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUNqRSxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBSSxDQUFDLFNBQVMsRUFBRSx1Q0FBdUMsQ0FBQyxDQUFDO1lBQ3JGLGtCQUFrQixFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7U0FDakQsQ0FBQyxDQUFBO1FBRUYsS0FBSSxNQUFNLFVBQVUsSUFBSSxxQkFBcUIsRUFBRTtZQUM3QyxNQUFNLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxHQUFHLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQ25FLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLFVBQVUsU0FBUyxFQUFFO2dCQUMxRSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO2dCQUNuQyxPQUFPLEVBQUUsT0FBTyxJQUFJLEdBQUcsVUFBVSxVQUFVO2dCQUMzQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBSSxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQ3ZFLFdBQVcsRUFBRTtvQkFDVCxZQUFZLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTO2lCQUN0QztnQkFDRCxNQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUM7YUFDeEIsQ0FBQyxDQUFDO1lBQ0gsNERBQTREO1lBQzVELEtBQUssQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1NBQzNEO0lBRUgsQ0FBQztDQUNGO0FBM0JELHNEQTJCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIGR5bmFtb2RiIGZyb20gJ0Bhd3MtY2RrL2F3cy1keW5hbW9kYic7XG5jb25zdCBsaXN0T2ZMYW1iZGFGdW5jdGlvbnMgPSByZXF1aXJlKCcuL2xhbWJkYXMtbGlzdCcpO1xuXG5pbnRlcmZhY2UgSGFuZGxlcnMge1xuICBbbGFtYmRhTmFtZTogc3RyaW5nXTogbGFtYmRhLklGdW5jdGlvblxufVxuXG5leHBvcnQgY2xhc3MgTGFtYmRhc0luZnJhc3RydWN0dXJlIGV4dGVuZHMgY2RrLkNvbnN0cnVjdCB7XG4gIHB1YmxpYyByZWFkb25seSBoYW5kbGVyczogSGFuZGxlcnMgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IGFueSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICBcbiAgICBjb25zdCBkYlV0aWxMYXllciA9IG5ldyBsYW1iZGEuTGF5ZXJWZXJzaW9uKHRoaXMsICdEYiBVdGlsIExheWVyJywge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KGpvaW4oX19kaXJuYW1lLCAnLi4vLi4vLi4vc2hhcmVkX3NlcnZpY2VzL2RhbF9keW5hbW9kYicpKSxcbiAgICAgIGNvbXBhdGlibGVSdW50aW1lczogW2xhbWJkYS5SdW50aW1lLk5PREVKU18xMl9YXVxuICAgIH0pXG5cbiAgICBmb3IoY29uc3QgbGFtYmRhTmFtZSBpbiBsaXN0T2ZMYW1iZGFGdW5jdGlvbnMpIHtcbiAgICAgIGNvbnN0IHsgcGF0aEZyb21Sb290LCBoYW5kbGVyIH0gPSBsaXN0T2ZMYW1iZGFGdW5jdGlvbnNbbGFtYmRhTmFtZV1cbiAgICAgIHRoaXMuaGFuZGxlcnNbbGFtYmRhTmFtZV0gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsIGAke2xhbWJkYU5hbWV9SGFuZGxlcmAsIHtcbiAgICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTJfWCxcbiAgICAgICAgICBoYW5kbGVyOiBoYW5kbGVyIHx8IGAke2xhbWJkYU5hbWV9LmhhbmRsZXJgLFxuICAgICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChqb2luKF9fZGlybmFtZSwgJy4uLy4uLy4uLycsIHBhdGhGcm9tUm9vdCkpLFxuICAgICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgICAgIFRBQkxFX0VOVElUWTogcHJvcHMudGFibGUudGFibGVOYW1lXG4gICAgICAgICAgfSxcbiAgICAgICAgICBsYXllcnM6IFtkYlV0aWxMYXllcl1cbiAgICAgIH0pO1xuICAgICAgLy8gZ3JhbnQgdGhlIGxhbWJkYSByb2xlIHJlYWQvd3JpdGUgcGVybWlzc2lvbnMgdG8gb3VyIHRhYmxlXG4gICAgICBwcm9wcy50YWJsZS5ncmFudFJlYWRXcml0ZURhdGEodGhpcy5oYW5kbGVyc1tsYW1iZGFOYW1lXSk7XG4gICAgfVxuXG4gIH1cbn0iXX0=