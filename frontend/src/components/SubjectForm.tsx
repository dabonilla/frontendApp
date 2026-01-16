import { NavLink } from 'react-router-dom';
import { createSubject, updateSubject, deleteSubject } from '@/services/subjectService';
import type { Subject } from "../types/Subject";
import type { CreateSubjectRequest } from "../types/CreateSubjectRequest"
import { useColorModeValue } from "@/components/ui/color-mode"
import { api } from "../lib/axios";
import { useEffect, useState } from "react";
import {
  Flex, VStack, Heading, Text, Button, Table, Dialog, CloseButton, Portal,
  Field, Input, Stack, HStack, Box, Spinner
} from "@chakra-ui/react";

export const SubjectForm = () => {
  const headingColor = useColorModeValue("textHeading", "textHeading");
  const textColor = useColorModeValue("textBody", "textBody");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [form, setForm] = useState<CreateSubjectRequest>({
    name: "",
    code: 0
  });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [id, setId] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [spinner, setSpinner] = useState(false)

  function getSubjects() {
    setSpinner(true)
    api.get<Subject[]>("/getAllSubjects").then((response) => {
      setSubjects(response.data);
    });
    setSpinner(false)
  }

  useEffect(() => {
    getSubjects();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await createSubject(form);
      getSubjects()

      setIsOpen(false);
      setIsEditing(false);
      setForm({ name: "", code: 0 });
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUpdate = async () => {
    try {
      setLoading(true);
      await updateSubject(id, form);
      getSubjects()
      setIsOpen(false);
      setIsEditing(false);
      setForm({ name: "", code: 0 });
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDelete = async () => {

    try {
      setLoading(true);
      await deleteSubject(id);
      getSubjects()
      setOpenDelete(false);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  function updateForm(subject: Subject, id: number) {
    setForm({
      name: subject.name,
      code: subject.code,
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
        <Heading size="4xl" color={headingColor}>Gestión de Asignaturas</Heading>
        <Text color={textColor} maxW="600px">
          Crea nuevas asignaturas, actualiza datos, consulta información y mantén todo bajo control en un solo lugar.
        </Text>
      </VStack>

      {/* Dialog */}
      <HStack mb={12}>
        <Dialog.Root open={isOpen} onOpenChange={(details) => setIsOpen(details.open)}>
          <Dialog.Trigger asChild>
            <Button size="lg" colorScheme="teal" onClick={() => {
              setIsEditing(false);
              setForm({ name: "", code: 0 });
            }}>
              Crear asignatura
            </Button>
          </Dialog.Trigger>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Formulario asignatura</Dialog.Title>
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
                      <Field.Label>Código</Field.Label>
                      <Input type='number' value={form.code}
                        onChange={(e) => setForm({ ...form, code: Number(e.target.value) })}
                        placeholder=""
                        flex="1"
                      />
                    </Field.Root>




                  </Stack>

                </Dialog.Body>
                <Dialog.Footer>

                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Cancelar</Button>
                  </Dialog.ActionTrigger>
                  <Button onClick={isEditing ? handleSubmitUpdate : handleSubmit}
                    loading={loading}

                    disabled={!form.name}
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
                    ¿Está seguro de eliminar esta asignatura?
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
        :
        <Box>
          <Table.Root size="sm" variant="outline">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Nombres</Table.ColumnHeader>
                <Table.ColumnHeader>Código</Table.ColumnHeader>
                <Table.ColumnHeader>Actualizar</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">Eliminar</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {subjects.map((subject) => (
                <Table.Row key={subject.id}>
                  <Table.Cell>{subject.name}</Table.Cell>
                  <Table.Cell>{subject.code}</Table.Cell>
                  <Table.Cell> <Button variant="outline" onClick={() => updateForm(subject, subject.id)}>✏️</Button> </Table.Cell>
                  <Table.Cell textAlign="end">
                    <Button variant="outline" onClick={() => openDeleteDialog(subject.id)}>🗑️</Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>}
    </Flex>
  )
}