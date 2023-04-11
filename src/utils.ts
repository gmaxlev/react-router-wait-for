export async function fetch(ms: number) {
  return await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
