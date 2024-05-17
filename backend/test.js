var AWS = require('aws-sdk');
require('dotenv').config();

const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

const region = "";
const accessKeyId = "";
const secretAccessKey = "";
const tableName = process.env.USER_TABLE;

// const dynamoDB = new AWS.DynamoDB({
//   region: region,
//   accessKeyId: accessKeyId,
//   secretAccessKey: secretAccessKey,
// });

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

console.log("region: ", region);

const s3Client = new S3Client({
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    }
});
console.log("s3Client");
async function f() {
    const { Body, ContentType } = await s3Client.send(new GetObjectCommand({
        Bucket: "",
        Key: "",
    }));
    console.log("Body: ", Body);
    console.log("ContentType: ", ContentType);
}

f();