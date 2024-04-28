var AWS = require('aws-sdk');
var eks = require('./eks.json');

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const region = eks.AWS_REGION;
const accessKeyId = eks.AWS_ACCESS_KEY_ID;
const secretAccessKey = eks.AWS_SECRET_ACCESS_KEY;
const tableName = eks.USER_TABLE;

const dynamoDB = new AWS.DynamoDB({
  region: region,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

// async function f(){
//     const existingUser = await dynamoDB.scan ({
//         TableName: tableName,
//         FilterExpression: "email = :email",
//         ExpressionAttributeValues: {
//             ":email": {
//                 S: "Foo foo foo"
//             }
//         }
//     }, function (err, data) {
//         if (err) {
//             console.log("err: ", err);
//             return err;
//         } else {
//             console.log("data: ", data);
//             return data.Item;
//         }
//     });
// }

// f();
// var params = {
//   Item: {
//     userID: {
//       N: "1235" // Number value.
//     },
//     email: {
//       S: "Foo foo foo" // String value.
//     }
//   },
//   ReturnConsumedCapacity: "TOTAL",
//   TableName: tableName,
// };

// const x = dynamoDB.putItem(params, function(err, data) {
//   if (err) {
//     console.log(err, err.stack);
//   }
//   else {
//     console.log(data);
//     return data;
//   }
// });

const s3Client = new S3Client({
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    }
});

console.log("x: ", x);

const params2 = {
    Bucket: "my-bucket",
    Key: "my-key",
    Body: "Hello World!",
    ContentType: "text/plain"
};

const command = new PutObjectCommand(params2);

s3Client.send(command).then((data) => {
    console.log(data);
}
).catch((error) => {
    console.error(error);
});