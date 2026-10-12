import { expect, test } from '@playwright/test';

test('opens the home page', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('body')).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
});

test('opens the new reference hierarchy', async ({ page }) => {
  await page.goto('/reference');

  await expect(page.getByRole('heading', { name: 'Знайдіть свою ситуацію' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Організація охорони праці на підприємстві/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Підготовка працівника та допуск до роботи/ })).toBeVisible();

  await page.getByRole('button', { name: /Підготовка працівника та допуск до роботи/ }).click();
  await expect(page.getByRole('button', { name: /Вступний інструктаж/ })).toBeVisible();
});
