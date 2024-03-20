"use client"

import { Alert, Box, Button, Card, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Snackbar, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { createPixKeyACtion } from "./create-pix-key.action";
import { useRouter } from "next/navigation";

export function RegisterPixKeyForm({bankAccountId} : {bankAccountId: string}) {
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const createPixKeyActionWithBankAccountId = createPixKeyACtion.bind(null, bankAccountId)

  function handleClose() {
    setOpen(false)
  }

  async function onSubmit(formData: FormData) {
   await createPixKeyActionWithBankAccountId(formData) 
    setOpen(true)
  }

  return (
    <div>
      <Typography variant="h5">Cadastrar chave pix</Typography>

      <Card>
        <form
          style={{ display: "flex", flexDirection: "column" }}
          action={onSubmit}
        >
          <FormControl sx={{ mt: 2 }} required>
            <FormLabel>Escolha um tipo de chave</FormLabel>
            <RadioGroup name="kind">
              <FormControlLabel value="cpf" control={<Radio />} label="CPF" />
              <FormControlLabel
                value="email"
                control={<Radio />}
                label="E-mail"
              />
            </RadioGroup>
          </FormControl>
          <TextField name="key" label="Digite sua chave pix" margin="normal" />
          <Box display={"flex"} gap={1} mt={2}>
            <Button type="submit" variant="contained">
              Cadastrar
            </Button>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              onClick={() => {
                router.push(`/bank-accounts/${bankAccountId}/dashboard`);
              }}
            >
              Voltar
            </Button>
          </Box>
        </form>
      </Card>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <Alert onClose={handleClose} severity="success" sx={{width: "100%"}}>Chave Pix cadastrada com sucesso</Alert>

      </Snackbar>
    </div>
  );
}