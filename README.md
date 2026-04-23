# FlowHandler Logic for DiagramTool

## GitHub Packages (private)

Package: @rbd15/rd-flow-handler
Registry: https://npm.pkg.github.com

### Publish

1. Set token with package write permission.
2. Bump version.
3. Publish to GitHub Packages.

```bash
export NODE_AUTH_TOKEN=ghp_xxx
npm version patch
npm publish
```

### Consume from other projects

Use npm alias to keep imports as `rd-flow-handler`:

```json
"rd-flow-handler": "npm:@rbd15/rd-flow-handler@^0.5.2"
```

Then install with read token:

```bash
export NODE_AUTH_TOKEN=ghp_xxx
npm install
```

## Steps for update packages after any modification

# 1) (Opcional pero recomendado) subir versión del paquete
npm --prefix "D:\Projects\Node\Projects\DiagramTool\reactflow-own" version patch --no-git-tag-version

# 2) Build del paquete
npm --prefix "D:\Projects\Node\Projects\DiagramTool\reactflow-own" run build

# 3) Generar .tgz
npm pack "D:\Projects\Node\Projects\DiagramTool\reactflow-own"

# 4) Instalar en BackOffice (ajusta la versión del tgz generado)
npm --prefix "D:\Projects\Node\Projects\Chatweb\Dev\MonoRepo\apps\BackOffice" install "D:\Projects\Node\Projects\FlowHandler\reactflow-own-1.0.X.tgz" --force

# 5) Limpiar cache de CRA (evita bundle viejo)
Remove-Item -Recurse -Force "D:\Projects\Node\Projects\Chatweb\Dev\MonoRepo\apps\BackOffice\node_modules\.cache" -ErrorAction SilentlyContinue

# 6) Levantar BackOffice
npm --prefix "D:\Projects\Node\Projects\Chatweb\Dev\MonoRepo\apps\BackOffice" start