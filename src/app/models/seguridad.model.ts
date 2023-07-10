export class Usuario {
  sIdDependencia: string;
  sub: string;
  lRoles: Rol[];
  nIdOperador: number;
  exp: number;
  sIdTipoControlMigratorio: string;
}

export class Rol {
  authority: string;
}

export class Autenticacion {
  username: string;
  password: string;
  modulo: Modulo;
}

export class Modulo {
  sModulo: string;
  sModulosPermiso: string[];
}

export class AuthOut {
  status: number;
  type: string;
  token: string;
  tokenExpire: number;
}

export class RefreshTokenOut {
  status: number;
  type: string;
  token: string;
  tokenExpire: number;
}
