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
        for (const lambdaName in listOfLambdaFunctions) {
            const { pathFromRoot, handler } = listOfLambdaFunctions[lambdaName];
            this.handlers[lambdaName] = new lambda.Function(this, `${lambdaName}Handler`, {
                runtime: lambda.Runtime.NODEJS_12_X,
                handler: handler || `${lambdaName}.handler`,
                code: lambda.Code.fromAsset(path_1.join(__dirname, '../../../', pathFromRoot)),
                environment: {
                    TABLE_ENTITY: props.table.tableName
                }
            });
            // grant the lambda role read/write permissions to our table
            props.table.grantReadWriteData(this.handlers[lambdaName]);
        }
    }
}
exports.LambdasInfrastructure = LambdasInfrastructure;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhcy1pbmZyYXN0cnVjdHVyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxhbWJkYXMtaW5mcmFzdHJ1Y3R1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsK0JBQTRCO0FBQzVCLG1EQUFxQztBQUNyQyw0REFBOEM7QUFFOUMsTUFBTSxxQkFBcUIsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQU14RCxNQUFhLHFCQUFzQixTQUFRLEdBQUcsQ0FBQyxTQUFTO0lBR3RELFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBVTtRQUN0RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBSEgsYUFBUSxHQUFhLEVBQUUsQ0FBQztRQU10QyxLQUFJLE1BQU0sVUFBVSxJQUFJLHFCQUFxQixFQUFFO1lBQzdDLE1BQU0sRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLEdBQUcscUJBQXFCLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDbkUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsVUFBVSxTQUFTLEVBQUU7Z0JBQzFFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7Z0JBQ25DLE9BQU8sRUFBRSxPQUFPLElBQUksR0FBRyxVQUFVLFVBQVU7Z0JBQzNDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDdkUsV0FBVyxFQUFFO29CQUNULFlBQVksRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVM7aUJBQ3RDO2FBQ0osQ0FBQyxDQUFDO1lBQ0gsNERBQTREO1lBQzVELEtBQUssQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1NBQzNEO0lBRUgsQ0FBQztDQUNGO0FBdEJELHNEQXNCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIGR5bmFtb2RiIGZyb20gJ0Bhd3MtY2RrL2F3cy1keW5hbW9kYic7XG5jb25zdCBsaXN0T2ZMYW1iZGFGdW5jdGlvbnMgPSByZXF1aXJlKCcuL2xhbWJkYXMtbGlzdCcpO1xuXG5pbnRlcmZhY2UgSGFuZGxlcnMge1xuICBbbGFtYmRhTmFtZTogc3RyaW5nXTogbGFtYmRhLklGdW5jdGlvblxufVxuXG5leHBvcnQgY2xhc3MgTGFtYmRhc0luZnJhc3RydWN0dXJlIGV4dGVuZHMgY2RrLkNvbnN0cnVjdCB7XG4gIHB1YmxpYyByZWFkb25seSBoYW5kbGVyczogSGFuZGxlcnMgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IGFueSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICBcblxuICAgIGZvcihjb25zdCBsYW1iZGFOYW1lIGluIGxpc3RPZkxhbWJkYUZ1bmN0aW9ucykge1xuICAgICAgY29uc3QgeyBwYXRoRnJvbVJvb3QsIGhhbmRsZXIgfSA9IGxpc3RPZkxhbWJkYUZ1bmN0aW9uc1tsYW1iZGFOYW1lXVxuICAgICAgdGhpcy5oYW5kbGVyc1tsYW1iZGFOYW1lXSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgYCR7bGFtYmRhTmFtZX1IYW5kbGVyYCwge1xuICAgICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xMl9YLFxuICAgICAgICAgIGhhbmRsZXI6IGhhbmRsZXIgfHwgYCR7bGFtYmRhTmFtZX0uaGFuZGxlcmAsXG4gICAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KGpvaW4oX19kaXJuYW1lLCAnLi4vLi4vLi4vJywgcGF0aEZyb21Sb290KSksXG4gICAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICAgICAgVEFCTEVfRU5USVRZOiBwcm9wcy50YWJsZS50YWJsZU5hbWVcbiAgICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIGdyYW50IHRoZSBsYW1iZGEgcm9sZSByZWFkL3dyaXRlIHBlcm1pc3Npb25zIHRvIG91ciB0YWJsZVxuICAgICAgcHJvcHMudGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKHRoaXMuaGFuZGxlcnNbbGFtYmRhTmFtZV0pO1xuICAgIH1cblxuICB9XG59Il19