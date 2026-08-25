# API documentation

All protected requests use `Authorization: Bearer <JWT>`.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | public | create student account |
| POST | `/api/auth/login` | public | issue one-day JWT |
| GET | `/api/internships?q=&mode=` | public | catalogue search/filter |
| GET | `/api/internships/:id` | public | role detail and skills |
| POST | `/api/internships/:id/apply` | student | transactional application |
| GET | `/api/applications` | signed in | own applications or admin all |
| GET/PUT | `/api/students/me` | student | profile read/update |
| GET | `/api/students/dashboard` | student | calculated personal metrics |
| PATCH | `/api/applications/:id/status` | admin/company | move recruitment status |
| GET | `/api/analytics` | admin | MySQL aggregate metrics |
| GET | `/api/health` | public | health check |

Errors are JSON `{error: string}` with 400 validation, 401 auth, 403 authorization, 404 missing resource and 409 duplicate semantics.
