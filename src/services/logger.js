const AUTH_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;

const ALLOWED_STACKS = ['backend', 'frontend'];
const ALLOWED_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const ALLOWED_PACKAGES = [
  'api', 'component', 'hook', 'page', 'state', 'style',
  'auth', 'config', 'middleware', 'utils',
  'cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'
];

export default async function Log(stack, level, pkg, message) {
  stack = String(stack).toLowerCase();
  level = String(level).toLowerCase();
  pkg = String(pkg).toLowerCase();

  if (!ALLOWED_STACKS.includes(stack)) {
    console.error(`Invalid stack: ${stack}`);
    return;
  }
  if (!ALLOWED_LEVELS.includes(level)) {
    console.error(`Invalid level: ${level}`);
    return;
  }
  if (!ALLOWED_PACKAGES.includes(pkg)) {
    console.error(`Invalid package: ${pkg}`);
    return;
  }
  if (!AUTH_TOKEN) {
    console.error('REACT_APP_ACCESS_TOKEN not set in environment.');
    return;
  }
  const payload = { stack, level, package: pkg, message };
  try {
    await fetch('http://20.244.56.144/evaluation-service/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error('Logging error:', err);
  }
} 