import {
    Button, Flex, VStack, Heading, Box, NumberInput, Field,
    Text, Portal, Select, createListCollection, HStack, Table
} from "@chakra-ui/react"
import { NavLink } from 'react-router-dom';
import { Toaster, toaster } from "@/components/ui/toaster"
import { useColorModeValue } from "@/components/ui/color-mode"
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import type { StudentName } from '@/types/student';
import type { SubjectName } from '@/types/Subject';
import type { Grade } from '@/types/Grade'
import { createGrade, getGrades } from '../services/gradesService'



export const GradesForm = () => {
    const headingColor = useColorModeValue("textHeading", "textHeading");
    const textColor = useColorModeValue("textBody", "textBody");

    const [loading, setLoading] = useState(true);
    const [studentName, setStudentName] = useState<StudentName[]>([]);
    const [subjectName, setSubjectName] = useState<SubjectName[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [valueInput, setvalueInput] = useState(0);
    const [studentIdInput, setStudentIdInput] = useState(0);
    const [subjectIdInput, setSubjectIdInput] = useState(0);
    const [studentNameSearch, setStudentNameSearch] = useState("");



    function getData() {
        try {
            setLoading(true)
            api.get<StudentName[]>("/findAllStudentsNames").then((response) => {
                setStudentName(response.data);
            });

            api.get<SubjectName[]>("/findAllSubjectsNames").then((response) => {
                setSubjectName(response.data);
            });
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        getData();
    }, []);

    async function handleSumbit() {
        
        try {

            const fechaISO = new Date().toISOString().split("T")[0];
            
            const promise = createGrade({
                value: valueInput,
                idStudent: studentIdInput,
                idSubject: subjectIdInput,
                registerDate: fechaISO
            })
            
            toaster.promise(promise, {
                success: {
                    title: "Nota guardada exitosamente!",
                    description: "Looks great",
                },
                error: {
                    title: "Carga fallida",
                    description: "Algo salió mal",
                },
                loading: { title: "Cargando...", description: "Por favor espere" },
            })
            
        } catch (error) {
            console.log(error)
        }
    }
    function handleSumbitGet() {
        console.log(studentNameSearch)
        try {
            getGrades(studentNameSearch).then((response) => {
                setGrades(response.data)
                if (response.data.length == 0){
                    toaster.create({
                        description: "El alumno no tiene notas registradas",
                        type: "info",
                      })
                }
            })
        } catch (error) {
            console.log(error)
        }
    }


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
            <Toaster />
            {/* Header */}
            <VStack gap={4} textAlign="center" mb={12}>
                <Heading size="4xl" color={headingColor}>Gestión de notas</Heading>
                <Text color={textColor} maxW="600px">
                Administra las notas de tus estudiantes de forma sencilla, precisa y organizada.
                </Text>
                <Button size="lg" colorScheme="teal">
                    <NavLink to={"/panel"}>Regresar</NavLink>
                </Button>
            </VStack>

            <HStack gap="20px">

                <Box p={4} borderWidth={1} borderRadius="lg">
                    <Select.Root collection={createListCollection({
                        items: studentName,
                        itemToString: (item) => item.studentName,
                        itemToValue: (item) => item.studentId.toString()
                    })} size="sm" width="320px" onValueChange={(value) => setStudentIdInput(Number(value.value))}>
                        <Select.HiddenSelect />
                        <Select.Label>Selecciona un estudiante</Select.Label>
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {studentName.map((studentN) => (
                                        <Select.Item item={studentN} key={studentN.studentId}>
                                            {studentN.studentName}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                </Box>
                <Box p={4} borderWidth={1} borderRadius="lg">
                    <Select.Root collection={createListCollection({
                        items: subjectName,
                        itemToString: (item) => item.subjectName,
                        itemToValue: (item) => item.subjectId.toString()
                    })} size="sm" width="320px" onValueChange={(value) => setSubjectIdInput(Number(value.value))}>
                        <Select.HiddenSelect />
                        <Select.Label>Selecciona una asignatura</Select.Label>
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {subjectName.map((subjectN) => (
                                        <Select.Item item={subjectN} key={subjectN.subjectId}>
                                            {subjectN.subjectName}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                </Box>
                <Box p={4} borderWidth={1} borderRadius="lg">
                    <Field.Root>
                        <Field.Label>Nota</Field.Label>
                        <NumberInput.Root width="200px" value={valueInput.toString()} onValueChange={(details) => setvalueInput(Number(details.value))} min={0} max={10}>
                            <NumberInput.Control />
                            <NumberInput.Input />
                        </NumberInput.Root>
                    </Field.Root>
                </Box>
                <Box p={4} borderWidth={2} borderRadius="lg">
                    <Button size="lg" loading={loading} colorScheme="teal" onClick={handleSumbit}>Registrar</Button>
                </Box>

            </HStack>

            <VStack gap={4} textAlign="center" mt={12}>
                <Heading color={headingColor}>Listar notas</Heading>
                <Text color={textColor} maxW="600px">
                    Aquí puedes revisar las notas de cada estudiante.
                </Text>

                <HStack gap={4} textAlign="center" mb={4}>
                    <Box p={4} borderWidth={1} borderRadius="lg">
                        <Select.Root collection={createListCollection({
                            items: studentName,
                            itemToString: (item) => item.studentName,
                            itemToValue: (item) => item.studentName
                        })} size="sm" width="320px" onValueChange={(value) => setStudentNameSearch(String(value.value))}>
                            <Select.HiddenSelect />
                            <Select.Label>Selecciona un estudiante</Select.Label>
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder="" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {studentName.map((studentN) => (
                                            <Select.Item item={studentN} key={studentN.studentId}>
                                                {studentN.studentName}
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    </Box>

                    <Box p={4} borderWidth={2} borderRadius="lg">
                        <Button size="lg" loading={loading} colorScheme="teal" onClick={handleSumbitGet}>Buscar</Button>
                    </Box>

                </HStack>
                <Box>
                    <Table.Root size="sm" variant="outline">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>Nota</Table.ColumnHeader>
                                <Table.ColumnHeader>Fecha de registro</Table.ColumnHeader>
                                <Table.ColumnHeader>Nombre estudiante</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="end">Nombre asignatura</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {grades.map((grade) => (
                                <Table.Row key={grade.id}>
                                    <Table.Cell>{grade.value}</Table.Cell>
                                    <Table.Cell>{grade.registerDate}</Table.Cell>
                                    <Table.Cell>{grade.studentName}</Table.Cell>
                                    <Table.Cell textAlign="end">{grade.subjectName}</Table.Cell>

                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>

            </VStack>

        </Flex>
    )
}