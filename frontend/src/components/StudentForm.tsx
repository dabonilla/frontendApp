import { NavLink } from 'react-router-dom';
import { createStudent, updateStudent, deleteStudent } from '@/services/studentService';
import type { Student } from "../types/student";
import type { CreateStudentRequest } from "../types/CreateStudentRequest"
import { useColorModeValue } from "@/components/ui/color-mode"
import { api } from "../lib/axios";
import { useEffect, useState } from "react";
import {
  Flex, VStack, Heading, Text, Button, Table, Dialog, CloseButton,
  Portal, Field, Input, Stack, HStack, Spinner, Box
} from "@chakra-ui/react";

export const StudentForm = () => {

  const headingColor = useColorModeValue("textHeading", "textHeading");
  const textColor = useColorModeValue("textBody", "textBody");

  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState<CreateStudentRequest>({
    name: "",
    lastName: "",
    email: "",
    dateOfBirth: ""
  });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [id, setId] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [spinner, setSpinner] = useState(false)


  function getStudents() {
    setSpinner(true)
    api.get<Student[]>("/allStudents").then((response) => {
      setStudents(response.data);
    });
    setSpinner(false)
  }

  useEffect(() => {
    getStudents();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await createStudent(form);
      getStudents()
      setIsOpen(false);
      setIsEditing(false);
      setForm({ name: "", lastName: "", email: "", dateOfBirth: "" });
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUpdate = async () => {
    try {
      setLoading(true);
      await updateStudent(id, form);
      getStudents()
      setIsOpen(false);
      setIsEditing(false);
      setForm({ name: "", lastName: "", email: "", dateOfBirth: "" });
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDelete = async () => {
    try {
      setLoading(true);
      await deleteStudent(id);
      getStudents()
      setOpenDelete(false);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  function updateStudentForm(student: Student, id: number) {
    setForm({
      name: student.name,
      lastName: student.lastName,
      email: student.email,
      dateOfBirth: student.dateOfBirth
    })
    setId(id)
    setIsEditing(true)
    setIsOpen(true)

  }

  function openDeleteDialog(id: number) {
    setId(id)
    setOpenDelete(true)

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
      {/* Header */}
      <VStack gap={4} textAlign="center" mb={12}>
        <Heading size="4xl" color={headingColor}>Gestión de Alumnos</Heading>
        <Text color={textColor} maxW="600px">
          Gestiona toda la información académica de tus alumnos de forma sencilla y eficiente.
        </Text>
      </VStack>


      {/* Dialog */}
      <HStack mb={10}>
        <Dialog.Root open={isOpen} onOpenChange={(details) => setIsOpen(details.open)}>
          <Dialog.Trigger asChild>
            <Button colorScheme="teal" size="lg" onClick={() => {
              setIsEditing(false);
              setForm({ name: "", lastName: "", email: "", dateOfBirth: "" });
            }}>
              Crear alumno
            </Button>
          </Dialog.Trigger>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Formulario alumno</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>

                  <Stack gap="8" maxW="sm" css={{ "--field-label-width": "96px" }}>

                    <Field.Root orientation="horizontal">
                      <Field.Label>Nombre</Field.Label>
                      <Input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder=""
                        flex="1"
                      />
                    </Field.Root>

                    <Field.Root orientation="horizontal">
                      <Field.Label>Apellido</Field.Label>
                      <Input value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        placeholder=""
                        flex="1"
                      />
                    </Field.Root>

                    <Field.Root orientation="horizontal">
                      <Field.Label>Email</Field.Label>
                      <Input type="email"
                        placeholder="me@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        flex="1"
                      />
                    </Field.Root>

                    <Field.Root orientation="horizontal">
                      <Field.Label>Fecha de nacimiento</Field.Label>
                      <Input type="date"
                        placeholder=""
                        value={form.dateOfBirth}
                        onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                        flex="1" />
                    </Field.Root>


                  </Stack>

                </Dialog.Body>
                <Dialog.Footer>

                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Cancelar</Button>
                  </Dialog.ActionTrigger>
                  <Button onClick={isEditing ? handleSubmitUpdate : handleSubmit}
                    loading={loading}

                    disabled={!form.name || !form.email || !form.dateOfBirth}
                  >{isEditing ? 'Actualizar' : 'Guardar'}
                  </Button>

                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>


        <Dialog.Root open={openDelete} onOpenChange={(details) => setOpenDelete(details.open)} >

          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Eliminar alumno</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <p>
                    ¿Está seguro de eliminar este usuario?
                  </p>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Cancelar</Button>
                  </Dialog.ActionTrigger>
                  <Button onClick={handleSubmitDelete} loading={loading}>Eliminar</Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>

        <Button size="lg" colorScheme="teal">
          <NavLink to={"/panel"}>Regresar</NavLink>
        </Button>
      </HStack>

      {/* table */}

      {spinner ? <Spinner size="xl" />
        : <Box><Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Nombres</Table.ColumnHeader>
              <Table.ColumnHeader>Apellidos</Table.ColumnHeader>
              <Table.ColumnHeader>Correo</Table.ColumnHeader>
              <Table.ColumnHeader>Fecha de nacimiento</Table.ColumnHeader>
              <Table.ColumnHeader>Actualizar</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Eliminar</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {students.map((student) => (
              <Table.Row key={student.id}>
                <Table.Cell>{student.name}</Table.Cell>
                <Table.Cell>{student.lastName}</Table.Cell>
                <Table.Cell>{student.email}</Table.Cell>
                <Table.Cell>{student.dateOfBirth}</Table.Cell>
                <Table.Cell> <Button variant="outline" onClick={() => updateStudentForm(student, student.id)}>✏️</Button> </Table.Cell>
                <Table.Cell textAlign="end">
                  <Button variant="outline" onClick={() => openDeleteDialog(student.id)}>🗑️</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root> </Box>}

    </Flex>
  )
}