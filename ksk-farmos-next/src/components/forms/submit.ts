export type SubmitResult = { ok: true } | { ok: false; error: string };

/**
 * Заглушка отправки форм.
 *
 * Настоящая отправка — почтой через Resend — появляется на этапе 5
 * брифа; проверка данных и защита от спама на сервере — на этапе 4.
 * До тех пор формы должны быть полностью рабочими с точки зрения
 * пользователя (проверка полей, состояния загрузки/успеха/ошибки),
 * но ничего никуда не уходит — только пишет в консоль браузера,
 * чтобы это было видно при проверке.
 */
export async function submitStub<T extends Record<string, unknown>>(
  formName: string,
  payload: T,
): Promise<SubmitResult> {
  console.info(`[${formName}] заглушка отправки`, payload);
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { ok: true };
}
