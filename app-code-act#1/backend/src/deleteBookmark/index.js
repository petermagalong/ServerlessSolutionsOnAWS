import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const dynamodb = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamodb);

export const handler = async message => {
  console.log(message);
  let bookmarkId = message.pathParameters.id
  let params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: bookmarkId
    }
  };

  console.log(`Deleting bookmark ${bookmarkId} from table ${process.env.TABLE_NAME}`);
  
  const command = new DeleteCommand(params);

  const response = await docClient.send(command);
  console.log(response);
  

  return {
    statusCode: 200,
    headers: {"Access-Control-Allow-Origin": '*'},
    body: JSON.stringify({})
  };
}
