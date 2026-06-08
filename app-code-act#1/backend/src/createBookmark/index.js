import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const dynamodb = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamodb);

export const handler = async message => {
  console.log(message);

  if (message.body) {
    let bookmark = JSON.parse(message.body);
    let params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        id: bookmark.id,
        url: bookmark.url,
        name: bookmark.name,
        description: bookmark.description,
        username: bookmark.username ,
        shared: bookmark.shared 
      }
    };
    console.log(`Adding bookmark to table ${process.env.TABLE_NAME}`);
    
    const command = new PutCommand(params);

    const response = await docClient.send(command);
    console.log(response);
  
    console.log(`New bookmark added to the inventory`);
      
    }
    
  return {
    statusCode: 200,
    headers: {"Access-Control-Allow-Origin": '*'},
    body: JSON.stringify({})
  };

};
