import {  NavLink } from 'react-router-dom';
import {  Heading, Button, Flex, VStack, Text,  } from "@chakra-ui/react"
import {  useColorModeValue } from "@/components/ui/color-mode"

export const LandingPage = () => {
    const textColor = useColorModeValue("gray.600", "gray.300");
    const bgColor = useColorModeValue("gray.50", "gray.800");

    return (
        <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={bgColor}
    >
      <VStack gap={6} textAlign="center">
        <Heading size="6xl">
          Campus virtual
        </Heading>

        <Text fontSize="lg" color={textColor} maxW="400px">
          Una aplicación simple para gestionar estudiantes de forma rápida
          y eficiente.
        </Text>

        <Button
          colorScheme="teal"
          size="lg"
        >
            <NavLink to="/panel" end>Comenzar</NavLink>
          
        </Button>
      </VStack>
    </Flex>
    )
}
export default LandingPage