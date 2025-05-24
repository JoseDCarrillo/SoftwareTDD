import { test, expect } from '@playwright/test';

test('Inicio de  sesion exitoso', async ({ page }) => {
  await page.goto('http://localhost:4200/login');
  await page.getByRole('textbox', { name: 'Correo electrónico' }).click();
  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('admin@mail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Admin123!');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
});


test('Inicio de sesion credenciales invaalidas', async ({ page }) => {
  await page.goto('http://localhost:4200/login');
  await page.getByRole('textbox', { name: 'Correo electrónico' }).click();
  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('user@example.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Prueba!123');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  //Validar el texto
  const mensajeError = await page.getByText('Credenciales inválidas');
  await expect(mensajeError).toHaveText('Credenciales inválidas');
});


test('Inicio de sesion no valido, no tiene caracter especial', async ({ page }) => {
  await page.goto('http://localhost:4200/login');
  await page.getByRole('textbox', { name: 'Correo electrónico' }).click();
  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('admin@mail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Admin123');
  await page.getByText('Bienvenido a Loyal AGPECorreo').click();

  //Validar el texto
  const mensajeError = await page.getByText('Debe incluir al menos un carácter especial.');
  await expect(mensajeError).toHaveText('Debe incluir al menos un carácter especial.');
});


test('Inicio de sesion no valido, el correo no es valido', async ({ page }) => {
  await page.goto('http://localhost:4200/login');
  await page.getByRole('textbox', { name: 'Correo electrónico' }).click();
  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('example@.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByText('Bienvenido a Loyal AGPECorreo').click();

  //Validar el texto
  const mensajeError = await page.getByText('El correo es inválido.');
  await expect(mensajeError).toHaveText('El correo es inválido.');
});


test('Inicio de  sesion exitoso, cambio de page Admin', async ({ page }) => {
  await page.goto('http://localhost:4200/login');
  await page.getByRole('textbox', { name: 'Correo electrónico' }).click();
  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('admin@mail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Admin123!');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await page.getByRole('button', { name: 'Administración' }).click();
  await page.getByRole('button', { name: 'Edición' }).click();
  await page.getByRole('button', { name: 'Lectura' }).click();
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
});


