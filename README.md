# Maya Home Rebrand (HACS Integration)

Rebranding para Home Assistant (HAOS) para aplicar:

- Nome da instância: **Maya Home**
- Logo/ícones: favicon + PWA + ajustes visuais (inclui tela de login)

> Limitação importante: por segurança, o HACS não edita o `configuration.yaml`. Você ainda precisa adicionar **uma** entrada em `frontend.extra_module_url`.

## Instalação (HACS)

1) HACS → **Integrações** → menu (⋮) → **Repositórios customizados**
2) Adicione este repositório como **Integração** (use a URL sem `.git`)
3) Instale

## Ativar a integração (1 vez)

1) Configurações → Dispositivos e serviços → **Adicionar integração**
2) Procure por **Maya Home Rebrand**
3) Conclua

Isso registra os arquivos estáticos no caminho `/maya-home-rebrand/`.

## Carregar o rebranding global (inclui login)

Edite seu `configuration.yaml`:

```yaml
homeassistant:
  name: Maya Home

frontend:
  extra_module_url:
    - /maya-home-rebrand/maya-home-rebrand.js
```

Reinicie o Home Assistant e faça um refresh completo do navegador (Ctrl+F5).

## PWA (celular)

Depois de ativar, no celular abra o Home Assistant no navegador e use **“Adicionar à tela inicial / Install”**.
