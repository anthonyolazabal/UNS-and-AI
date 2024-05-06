/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Avatar, AvatarBadge, Button, Divider, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Input, Progress, Radio, RadioGroup, Slide, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import logo from "./assets/artificial-intelligence.png"
import axios from "axios";
import React from "react";

const Header = () => {
    return (
        <Flex w="100%" mb={4}>
            <Avatar size="lg" name="Logo" src={logo}>
                <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar>
            <Flex flexDirection="column" mx="5" justify="center">
                <Text fontSize="lg" fontWeight="bold">
                    UNS Bot
                </Text>
                <Text color="green">Online</Text>
            </Flex>
        </Flex>
    );
};

const Messages = ({ messages }) => {
    const AlwaysScrollToBottom = () => {
        const elementRef = useRef();
        // @ts-ignore 
        useEffect(() => elementRef.current.scrollIntoView());
        return <div ref={elementRef} />;
    };

    return (
        <Flex w="100%" h="500px" overflowY="scroll" flexDirection="column" p="2">
            {messages.map((item, index) => {
                if (item.from === "me") {
                    return (
                        <Flex key={index} w="100%" justify="flex-end">
                            <Flex
                                bg="black"
                                color="white"
                                minW="100px"
                                maxW="750px"
                                my="1"
                                p="3"
                            >
                                <Text>{item.text}</Text>
                            </Flex>
                        </Flex>
                    );
                } else {
                    return (
                        <Flex key={index} w="100%" >
                            <Avatar
                                name="Computer"
                                src={logo}
                                bg="blue.300"
                                mr={2}
                            ></Avatar>
                            <Flex
                                bg="gray.100"
                                color="black"
                                minW="100px"
                                maxW="750px"
                                my="1"
                                p="3"
                            >
                                <Text>{item.text}</Text>
                            </Flex>
                        </Flex>
                    );
                }
            })}
            <AlwaysScrollToBottom />
        </Flex>
    );
};


const InputMessage = ({ inputMessage, setInputMessage, setIsLoading, handleSendMessage, questionList }) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [question, setQuestion] = React.useState('')


    const handleQuestion = async () => {
        await setInputMessage(question)
        await setIsOpen(false)
    };

    const closeQuestion = () => {
        setIsOpen(false)
    };

    const handleOpenDrawer = () => {
        setIsOpen(true)
    }

    return (
        <Flex w="100%" mt="5">
            <Input
                variant="outlined"
                placeholder="Ask me anything ? "
                _focus={{
                    border: "1px solid black",
                }}
                onSubmit={(e) => {
                    handleSendMessage();
                }}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
            />

            <Button className="" ml={4} onClick={function (event) { handleSendMessage(); setIsLoading(true); }} px={8} disabled={inputMessage.trim().length <= 0}>
                Send the question
            </Button>

            <Button className="" onClick={handleOpenDrawer} px={8} ml={4} bg="orange" disabled={inputMessage.trim().length <= 0}>
                What can I ask ?
            </Button>

            <Slide direction='bottom' in={isOpen} style={{ zIndex: 10 }}>
                <Drawer placement="bottom" isOpen={isOpen} onClose={function (): void {
                    setIsOpen(false)
                }}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerHeader borderBottomWidth='1px'>Typical questions </DrawerHeader>
                        <DrawerBody>
                            <RadioGroup defaultValue={question} onChange={setQuestion}>
                                <Stack direction='column' mb='4'>
                                    {questionList.map((question) => (
                                        <Radio value={question}>{question}</Radio>
                                    ))}
                                </Stack>
                            </RadioGroup>
                            <Button className="" onClick={handleQuestion} px={8} disabled={inputMessage.trim().length <= 0}>
                                Use the selected question
                            </Button>
                            <Button className="" onClick={closeQuestion} px={8} ml={4} bg="orange" disabled={inputMessage.trim().length <= 0}>
                                Close
                            </Button>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </Slide>
        </Flex >
    );
};

const Chat = ({ introMessage, promptinit, topics, questionList }) => {
    const [messages, setMessages] = useState([
        { from: "computer", text: introMessage },
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = () => {
        if (!inputMessage.trim().length) {
            return;
        }
        setIsLoading(true)
        setMessages((old) => [...old, { from: "me", text: inputMessage }]);
        setInputMessage("");

        const headers = {
            'Content-Type': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY
        }

        const userData = {
            promptinit: promptinit + JSON.stringify(topics),
            query: inputMessage
        };

        const apiURI = process.env.REACT_APP_API_URL + "/api/ai/gemini-pro"

        axios.post(apiURI, userData, {
            headers: headers
        }).then((response) => {
            setIsLoading(false)
            setMessages((old) => [...old, { from: "computer", text: response.data }]);
        }).catch(() => {
            setIsLoading(false)
            setMessages((old) => [...old, { from: "computer", text: "Sorry there was an issue asking my brain, try again later :(" }])
        }
        );
        setIsLoading(false)
    };

    const WaitingAnswer = ({ active }) => {
        if (active) {
            return <Progress size='xs' isIndeterminate />
        }
    }

    return (
        <Flex>
            <Flex h="100%" w="100%" flexDir="column">
                <Header />
                <Divider orientation='horizontal' />
                <Messages messages={messages} />
                <Divider orientation='horizontal' />
                <WaitingAnswer active={isLoading} />
                <InputMessage
                    questionList={questionList}
                    inputMessage={inputMessage}
                    setInputMessage={setInputMessage}
                    setIsLoading={setIsLoading}
                    handleSendMessage={handleSendMessage}
                />
            </Flex>
        </Flex>
    );
};

export default Chat;
