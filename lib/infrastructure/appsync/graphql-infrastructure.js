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
const aws_appsync_1 = require("@aws-cdk/aws-appsync");
const listOfLambdaFunctions = require('../lambda/lambdas-list');
class GraphQLInfrastructure extends cdk.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const api = new aws_appsync_1.GraphQLApi(this, 'Api', {
            name: `demoapi`,
            logConfig: {
                fieldLogLevel: aws_appsync_1.FieldLogLevel.ALL,
            },
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: aws_appsync_1.AuthorizationType.USER_POOL,
                    userPoolConfig: {
                        defaultAction: aws_appsync_1.UserPoolDefaultAction.ALLOW,
                        userPool: props.userPool
                    }
                }
            },
            schemaDefinitionFile: path_1.join(__dirname, '../../../services/graphql_service/schema.graphql'),
        });
        for (const lambdaName in props.lambdaSources) {
            const ds = api.addLambdaDataSource(`${lambdaName}DS`, lambdaName, props.lambdaSources[lambdaName]);
            listOfLambdaFunctions[lambdaName].resolvers.forEach((resolverConfig) => {
                ds.createResolver({
                    ...resolverConfig,
                    requestMappingTemplate: aws_appsync_1.MappingTemplate.fromString(`
          #**
            The value of 'payload' after the template has been evaluated
            will be passed as the event to AWS Lambda.
          *#
          {
            "version": "2017-02-28",
            "operation": "Invoke",
            "payload": {
              "args": $util.toJson($context.arguments),
              "identity": $util.toJson($context.identity)
           }
         }`),
                    responseMappingTemplate: aws_appsync_1.MappingTemplate.fromString(`
          #if($context.error)
            $util.error($context.error.message, $context.error.type, $context.result)
          #end
          $util.toJson($context.result)
          `),
                });
            });
        }
        // GraphQL API Endpoint
        new cdk.CfnOutput(this, 'Endpoint', {
            value: api.graphQlUrl
        });
    }
}
exports.GraphQLInfrastructure = GraphQLInfrastructure;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGhxbC1pbmZyYXN0cnVjdHVyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdyYXBocWwtaW5mcmFzdHJ1Y3R1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsK0JBQTRCO0FBQzVCLG1EQUFxQztBQUdyQyxzREFBdUk7QUFFdkksTUFBTSxxQkFBcUIsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQWFoRSxNQUFhLHFCQUFzQixTQUFRLEdBQUcsQ0FBQyxTQUFTO0lBRXRELFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBaUM7UUFDN0UsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEdBQUcsR0FBRyxJQUFJLHdCQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtZQUN0QyxJQUFJLEVBQUUsU0FBUztZQUNmLFNBQVMsRUFBRTtnQkFDVCxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxHQUFHO2FBQ2pDO1lBQ0QsbUJBQW1CLEVBQUU7Z0JBQ25CLG9CQUFvQixFQUFFO29CQUNwQixpQkFBaUIsRUFBRSwrQkFBaUIsQ0FBQyxTQUFTO29CQUM5QyxjQUFjLEVBQUU7d0JBQ2QsYUFBYSxFQUFFLG1DQUFxQixDQUFDLEtBQUs7d0JBQzFDLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtxQkFDekI7aUJBQ0Y7YUFDRjtZQUNELG9CQUFvQixFQUFFLFdBQUksQ0FBQyxTQUFTLEVBQUUsa0RBQWtELENBQUM7U0FDMUYsQ0FBQyxDQUFDO1FBR0gsS0FBSSxNQUFNLFVBQVUsSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFO1lBQzNDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLFVBQVUsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFFbkcscUJBQXFCLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQW1CLEVBQUUsRUFBRTtnQkFDMUUsRUFBRSxDQUFDLGNBQWMsQ0FBQztvQkFDaEIsR0FBRyxjQUFjO29CQUNqQixzQkFBc0IsRUFBRSw2QkFBZSxDQUFDLFVBQVUsQ0FBQzs7Ozs7Ozs7Ozs7O1dBWWxELENBQUM7b0JBQ0YsdUJBQXVCLEVBQUUsNkJBQWUsQ0FBQyxVQUFVLENBQUM7Ozs7O1dBS25ELENBQUM7aUJBQ0gsQ0FBQyxDQUFBO1lBQ0osQ0FBQyxDQUFDLENBQUE7U0FFSDtRQUVELHVCQUF1QjtRQUN2QixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNsQyxLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVU7U0FDdEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBMURELHNEQTBEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCB7IElVc2VyUG9vbCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2duaXRvJztcbmltcG9ydCB7IENmbkFwaUtleSwgR3JhcGhRTEFwaSwgTWFwcGluZ1RlbXBsYXRlLCBGaWVsZExvZ0xldmVsLCBBdXRob3JpemF0aW9uVHlwZSwgVXNlclBvb2xEZWZhdWx0QWN0aW9uIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWFwcHN5bmMnO1xuXG5jb25zdCBsaXN0T2ZMYW1iZGFGdW5jdGlvbnMgPSByZXF1aXJlKCcuLi9sYW1iZGEvbGFtYmRhcy1saXN0Jyk7XG5cblxuaW50ZXJmYWNlIEhhbmRsZXJzIHtcbiAgW2xhbWJkYU5hbWU6IHN0cmluZ106IGxhbWJkYS5JRnVuY3Rpb25cbn1cblxuaW50ZXJmYWNlIEdyYXBoUUxJbmZyYXN0cnVjdHVyZVByb3BzIHtcbiAgLy8gY29udGFjdFNlcnZpY2U6IGxhbWJkYS5JRnVuY3Rpb247XG4gIGxhbWJkYVNvdXJjZXM6IEhhbmRsZXJzO1xuICB1c2VyUG9vbDogSVVzZXJQb29sO1xufVxuXG5leHBvcnQgY2xhc3MgR3JhcGhRTEluZnJhc3RydWN0dXJlIGV4dGVuZHMgY2RrLkNvbnN0cnVjdCB7XG4gIHB1YmxpYyByZWFkb25seSBoYW5kbGVyOiBsYW1iZGEuRnVuY3Rpb247XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogR3JhcGhRTEluZnJhc3RydWN0dXJlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IEdyYXBoUUxBcGkodGhpcywgJ0FwaScsIHtcbiAgICAgIG5hbWU6IGBkZW1vYXBpYCxcbiAgICAgIGxvZ0NvbmZpZzoge1xuICAgICAgICBmaWVsZExvZ0xldmVsOiBGaWVsZExvZ0xldmVsLkFMTCxcbiAgICAgIH0sXG4gICAgICBhdXRob3JpemF0aW9uQ29uZmlnOiB7XG4gICAgICAgIGRlZmF1bHRBdXRob3JpemF0aW9uOiB7XG4gICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IEF1dGhvcml6YXRpb25UeXBlLlVTRVJfUE9PTCxcbiAgICAgICAgICB1c2VyUG9vbENvbmZpZzoge1xuICAgICAgICAgICAgZGVmYXVsdEFjdGlvbjogVXNlclBvb2xEZWZhdWx0QWN0aW9uLkFMTE9XLFxuICAgICAgICAgICAgdXNlclBvb2w6IHByb3BzLnVzZXJQb29sXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc2NoZW1hRGVmaW5pdGlvbkZpbGU6IGpvaW4oX19kaXJuYW1lLCAnLi4vLi4vLi4vc2VydmljZXMvZ3JhcGhxbF9zZXJ2aWNlL3NjaGVtYS5ncmFwaHFsJyksXG4gICAgfSk7XG5cbiAgICBcbiAgICBmb3IoY29uc3QgbGFtYmRhTmFtZSBpbiBwcm9wcy5sYW1iZGFTb3VyY2VzKSB7XG4gICAgICBjb25zdCBkcyA9IGFwaS5hZGRMYW1iZGFEYXRhU291cmNlKGAke2xhbWJkYU5hbWV9RFNgLCBsYW1iZGFOYW1lLCBwcm9wcy5sYW1iZGFTb3VyY2VzW2xhbWJkYU5hbWVdKTtcblxuICAgICAgbGlzdE9mTGFtYmRhRnVuY3Rpb25zW2xhbWJkYU5hbWVdLnJlc29sdmVycy5mb3JFYWNoKChyZXNvbHZlckNvbmZpZzogYW55KSA9PiB7XG4gICAgICAgIGRzLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgICAgICAuLi5yZXNvbHZlckNvbmZpZyxcbiAgICAgICAgICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBNYXBwaW5nVGVtcGxhdGUuZnJvbVN0cmluZyhgXG4gICAgICAgICAgIyoqXG4gICAgICAgICAgICBUaGUgdmFsdWUgb2YgJ3BheWxvYWQnIGFmdGVyIHRoZSB0ZW1wbGF0ZSBoYXMgYmVlbiBldmFsdWF0ZWRcbiAgICAgICAgICAgIHdpbGwgYmUgcGFzc2VkIGFzIHRoZSBldmVudCB0byBBV1MgTGFtYmRhLlxuICAgICAgICAgICojXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ2ZXJzaW9uXCI6IFwiMjAxNy0wMi0yOFwiLFxuICAgICAgICAgICAgXCJvcGVyYXRpb25cIjogXCJJbnZva2VcIixcbiAgICAgICAgICAgIFwicGF5bG9hZFwiOiB7XG4gICAgICAgICAgICAgIFwiYXJnc1wiOiAkdXRpbC50b0pzb24oJGNvbnRleHQuYXJndW1lbnRzKSxcbiAgICAgICAgICAgICAgXCJpZGVudGl0eVwiOiAkdXRpbC50b0pzb24oJGNvbnRleHQuaWRlbnRpdHkpXG4gICAgICAgICAgIH1cbiAgICAgICAgIH1gKSxcbiAgICAgICAgICByZXNwb25zZU1hcHBpbmdUZW1wbGF0ZTogTWFwcGluZ1RlbXBsYXRlLmZyb21TdHJpbmcoYFxuICAgICAgICAgICNpZigkY29udGV4dC5lcnJvcilcbiAgICAgICAgICAgICR1dGlsLmVycm9yKCRjb250ZXh0LmVycm9yLm1lc3NhZ2UsICRjb250ZXh0LmVycm9yLnR5cGUsICRjb250ZXh0LnJlc3VsdClcbiAgICAgICAgICAjZW5kXG4gICAgICAgICAgJHV0aWwudG9Kc29uKCRjb250ZXh0LnJlc3VsdClcbiAgICAgICAgICBgKSxcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICB9XG5cbiAgICAvLyBHcmFwaFFMIEFQSSBFbmRwb2ludFxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdFbmRwb2ludCcsIHtcbiAgICAgIHZhbHVlOiBhcGkuZ3JhcGhRbFVybFxuICAgIH0pO1xuICB9XG59Il19