import { SFNClient, SendTaskSuccessCommand } from "@aws-sdk/client-sfn";
const sfnClient = new SFNClient({});

var redirectToStepFunctions = function(lambdaArn, statemachineName, executionName) {
  const lambdaArnTokens = lambdaArn.split(":");
  const partition = lambdaArnTokens[1];
  const region = lambdaArnTokens[3];
  const accountId = lambdaArnTokens[4];

  console.log("partition=" + partition);
  console.log("region=" + region);
  console.log("accountId=" + accountId);

  const executionArn = "arn:" + partition + ":states:" + region + ":" + accountId + ":execution:" + statemachineName + ":" + executionName;
  console.log("executionArn=" + executionArn);

  const url = "https://console.aws.amazon.com/states/home?region=" + region + "#/executions/details/" + executionArn;
  return {
    statusCode: 302,
    headers: {
      Location: url
    }
  };
};

export const handler = async (event, context) => {
  try {
  console.log('Event= ' + JSON.stringify(event));
  const action = event.query.action;
  const taskToken = event.query.taskToken;
  const statemachineName = event.query.sm;
  const executionName = event.query.ex;

  var message = "";

  if (action === "approve") {
    message = { "Status": "Approved" };
  } else if (action === "reject") {
    message = { "Status": "Rejected" };
  } else {
    console.error("Unrecognized action. Expected: approve, reject.");
    return {
      statusCode: 400,
      body: JSON.stringify({"Status": "Failed to process the request. Unrecognized Action."})
    };
  }

  const input = { 
    output: JSON.stringify(message),
    taskToken: event.query.taskToken
  };

  await sfnClient.send(new SendTaskSuccessCommand(input));
  const redirectResponse = redirectToStepFunctions(context.invokedFunctionArn, statemachineName, executionName);
  console.log("successfully sent:");
  return redirectResponse;
  
}
  catch (error) {
    console.log("Unable to send status message to Step Function");
    throw new Error(JSON.stringify(error));
}

 
}