export async function Log(stack: string, level: string, pkg: string, message: string) {
  await fetch("http://4.224.186.213/evaluation-service/logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stack, level, package: pkg, message })
  });
}