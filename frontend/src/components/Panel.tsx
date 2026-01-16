import {  NavLink } from 'react-router-dom';
import { useColorModeValue } from "@/components/ui/color-mode"
import studentImg from "../assets/students.jpg";
import subjectImg from "../assets/subjects.jpg";
import gradesImg from "../assets/grades.jpg";
import type { CardData } from '../types/CardData';
import {
    Flex,
    VStack,
    Heading,
    Text,
    SimpleGrid,
    Box,
    Image,
    Button
  } from "@chakra-ui/react";
  
  const cards: CardData[] = [
    {
      title: "Estudiantes",
      imageUrl: studentImg,
      buttonText: "Gestionar alumnos",
      buttonurl: "/student-form"
    },
    {
      title: "Materias",
      imageUrl: subjectImg,
      buttonText: "Gestion materias",
      buttonurl: "/subject-form "
    },
    {
      title: "Notas",
      imageUrl: gradesImg,
      buttonText: "Gestionar notas",
      buttonurl: "/grades-form"
    },
  ];
  
export const Panel = () => {
    const headingColor = useColorModeValue("textHeading", "textHeading");
  const textColor = useColorModeValue("textBody", "textBody");
  const cardBg = useColorModeValue("bgSurface", "bgSurface");

  return (
    <Flex
      direction="column"
      minH="100vh"
      align="center"
      justify="flex-start"
      px={6}
      py={12}
      bg={useColorModeValue("bgPage", "bgPage")}
    >
      {/* Header */}
      <VStack gap={4} textAlign="center" mb={12}>
        <Heading size="4xl" color={headingColor}>Panel de Administración</Heading>
        <Text color={textColor} maxW="600px">
          Aquí puedes gestionar todos los aspectos de la aplicación de manera rápida y sencilla.
        </Text>
      </VStack>

      {/* Cards */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} w="100%" maxW="1200px">
        {cards.map((card) => (
          <Box
            key={card.title}
            bg={cardBg}
            borderRadius="md"
            shadow="md"
            overflow="hidden"
            textAlign="center"
          >
            <Image src={card.imageUrl} alt={card.title} objectFit="cover" w="100%" h="150px" />
            <VStack gap={4} p={6}>
              <Heading size="xl"  color={headingColor}>
                {card.title}
              </Heading>
              <Button size="lg" colorScheme="teal">
                <NavLink to={card.buttonurl}>{card.buttonText}</NavLink>
            </Button>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Flex>
  );
}