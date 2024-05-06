import * as React from "react"
import {
  ChakraProvider,
  Box,
  VStack,
  Grid,
  theme,
  Card,
  CardHeader,
  Heading,
  CardBody,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import Chat from "./Chat"
import mqtt from "mqtt"


// Broker WS connection to get the UNS data
const brokerws = process.env.REACT_APP_BROKER_WS_ADDRESS
const topicsRoot = {
  name: 'Root',
  attributes: {
    index: 0,
  },
  children: []
}
let uns_client: mqtt.MqttClient | null = null
export function App() {
  const promptinit = "You are a analytic expert that manage an industry unified namespace with a lot of informations on a factory production lines, including a mixer line, a filling line, a storage line and a packing line. Here are important informations on each unit that you will find in the dataset, temperature are in celsius, humidity in %, pressure is defined in Psi, weight are in kilograms, the speed of agitator is in rpm. Here is a the dataset that you need to analyse :"
  const introMessage = "Hi,I'm your UNS Bot, feel free to ask me anything about the data in your Unified Namespace."
  const questionList = [
    'Is there any alarms on my machines ?',
    'Can you list the process parameters used in my filling machines with there values ?',
    'Can you list the process parameters used in my mixer with there values ?',
    'What is the average humidity in my storage silos ?',
    'What is the average temperature in my storage silos ?',
    'What is the speed of the agistator on mixer1 ?'
  ]

  const uns_options: mqtt.IClientOptions = {
    protocol: "wss",
    port: parseInt(process.env.REACT_APP_WS_PORT),
    keepalive: 20,
    clientId: "uns_bot_" + Math.random().toString(16).substr(2, 8),
    username: process.env.REACT_APP_WS_USERNAME,
    password: process.env.REACT_APP_WS_PASSWORD,
  }

  const [topics, setTopics] = React.useState(topicsRoot)

  function connect_mqtt(broker: string) {
    uns_client?.end();
    uns_client = mqtt.connect('ws://' + broker + '/mqtt', uns_options);

    uns_client.on("message", function (topic, message) {
      updateTreeWithNewNode(topic.toString(), message.toString())
    });

    uns_client.on("connect", function () {
      console.log("Connected to " + broker)
      const subscribeTo = process.env.REACT_APP_TOPIC_ROOT + "/#"
      uns_client?.subscribe(subscribeTo, { qos: 1 }, function (err) {
        if (err) {
          console.log(err)
        }
      });
    });

    uns_client.on("error", function (err) {
      console.log("Error happend")
      console.log(err);
    });
  }

  async function disconnect_mqtt(client: mqtt.MqttClient | null) {
    await client?.end()
    console.log("Disconnected")
  }

  function updateTreeWithNewNode(topic, message) {
    const segments = topic.split('/');
    const nextData = Object.assign({}, topics);
    let currentNode = nextData;
    segments.forEach((segment: never) => {
      if (!currentNode.children) {
        currentNode.children = [];
      }
      let existingNode = currentNode.children.find(n => n.name === segment);
      if (!existingNode) {
        const newNode = { name: segment, attributes: { index: 1, value: JSON.parse(message).value } };
        currentNode.children.push(newNode);
        existingNode = newNode;
      } else {
        existingNode.attributes.index = existingNode.attributes.index + 1
        existingNode.attributes.value = JSON.parse(message).value
      }
      currentNode = existingNode;
    });
    setTopics(nextData)
  }
  React.useEffect(() => {
    connect_mqtt(brokerws)
    return () => { disconnect_mqtt(uns_client) }
  }, [])

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            <Card
              className='chat-card'
              overflow='hidden'
              h="48rem"
              boxShadow='2xl'
            >
              <CardHeader>
                <Heading size='xl' className='text-shadow'>Ask AI to extract informations from UNS</Heading>
              </CardHeader>
              <CardBody>
                <Chat introMessage={introMessage} promptinit={promptinit} topics={topics} questionList={questionList} />
              </CardBody>
            </Card>
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}