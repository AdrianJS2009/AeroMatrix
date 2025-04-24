# 🧾 Reflexiones personales sobre el desarrollo de un proyecto en Angular

## 🧠 Contexto

## Este proyecto ha sido desarrollado íntegramente en **Angular**, a pesar de que mi experiencia previa ha sido mayormente con **React**. El cambio de stack me obligó a adaptarme a una nueva forma de pensar y estructurar las aplicaciones frontend.

## 🔀 Diferencias clave entre Angular y React

| Aspecto          | Angular                                                        | React                                              |
| ---------------- | -------------------------------------------------------------- | -------------------------------------------------- |
| Arquitectura     | Estructura muy definida (modular, servicios, routing)          | Más libre, el desarrollador decide la arquitectura |
| Lenguaje base    | TypeScript obligatorio                                         | JavaScript, TypeScript opcional                    |
| Manejo de estado | Servicios, inyección de dependencias                           | Hooks (useState, useReducer, context)              |
| Sistema de rutas | Verboso pero muy completo (lazy loading, guards, etc.)         | Simpler con React Router                           |
| Templates        | HTML enriquecido con directivas (`*ngIf`, `[prop]`, `(event)`) | JSX (JavaScript + HTML)                            |
|  |

---

## 🚧 Retos y dificultades que enfrenté

### 1. **Estructura modular e inyección de dependencias**

Al principio, la separación estricta en módulos y el uso de `@Injectable()` para servicios fue confuso, pero luego entendí su valor para el mantenimiento y escalabilidad.

### 2. **Routing avanzado**

La configuración de rutas (`app.routes.ts`) con `loadChildren`, `canActivate`, etc., es más compleja que en React, pero ofrece un control muy preciso sobre la navegación y carga de módulos.

### 3. **Internacionalización**

La integración de `@ngx-translate/core` y la creación del servicio de traducción me resultaron bastante técnicas, especialmente para actualizar el idioma en toda la app en tiempo real.

### 4. **Formularios reactivos**

El uso de `FormGroup`, `FormControl` y validaciones reactivas me pareció más verboso y con mayor curva de aprendizaje en comparación con un simple `useState` en React.

### 5. **Uso de bibliotecas de UI (PrimeNG)**

Integrar componentes de PrimeNG implicó importar módulos específicos por componente y entender una sintaxis propia. Esto no es tan plug-and-play como con librerías de componentes para React.

---

## ✨ Aspectos positivos

- **Angular CLI**: Generar componentes, servicios o rutas con un solo comando me ahorró mucho tiempo.
- **Inyección de dependencias**: Muy útil para mantener el código limpio y testear componentes de forma aislada.
- **Sistema de módulos**: Permite dividir el proyecto en funcionalidades bien encapsuladas.

---
