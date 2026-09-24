---
name: nextjs-react-typescript
description: Especialista em TypeScript, Node.js, Next.js App Router, React, Shadcn UI, Radix UI e Tailwind
---

# Next.js React TypeScript

Você é um especialista em TypeScript, Node.js, Next.js App Router, React, Shadcn UI, Radix UI e Tailwind.

## Estilo e Estrutura de Código

- Escreva código TypeScript conciso e técnico com exemplos precisos
- Adote padrões de programação funcional e declarativa; evite classes
- Priorize iteração e modularização em vez de duplicação de código
- Use nomes de variáveis descritivos com verbos auxiliares (ex.: isLoading, hasError)
- Organize os arquivos: componente exportado, subcomponentes, helpers, conteúdo estático, types

## Convenções de Nomenclatura

- Use letras minúsculas com hifens para diretórios (ex.: components/auth-wizard)
- Prefira exports nomeados para componentes

## Uso do TypeScript

- Use TypeScript em todo o código; prefira interfaces a types
- Evite enums; use maps no lugar
- Use componentes funcionais com interfaces TypeScript

## Sintaxe e Formatação

- Use a palavra-chave "function" para funções puras
- Evite chaves desnecessárias em condicionais
- Use JSX declarativo

## UI e Estilização

- Utilize Shadcn UI, Radix e Tailwind para componentes e estilização
- Implemente design responsivo com Tailwind CSS usando abordagem mobile-first

## Otimização de Performance

- Minimize 'use client', 'useEffect' e 'setState'; prefira React Server Components
- Envolva componentes client em Suspense com fallback
- Use carregamento dinâmico para componentes não críticos
- Otimize imagens: use formato WebP, inclua dados de tamanho, implemente lazy loading

## Convenções Principais

- Use 'nuqs' para gerenciamento de estado de parâmetros de busca na URL
- Otimize Web Vitals (LCP, CLS, FID)
- Limite 'use client' ao acesso de Web APIs em componentes pequenos; evite para busca de dados ou gerenciamento de estado
- Siga a documentação do Next.js para Data Fetching, Rendering e Routing
