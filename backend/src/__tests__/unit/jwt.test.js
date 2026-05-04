const { generarToken, verificarToken } = require('../../utils/jwt');

describe('JWT Utils', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.JWT_EXPIRE = '1h';
  });

  describe('generarToken', () => {
    it('debe generar un token válido con un ID de usuario', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generarToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });

    it('debe generar tokens diferentes para IDs diferentes', () => {
      const userId1 = '507f1f77bcf86cd799439011';
      const userId2 = '507f1f77bcf86cd799439012';

      const token1 = generarToken(userId1);
      const token2 = generarToken(userId2);

      expect(token1).not.toBe(token2);
    });
  });

  describe('verificarToken', () => {
    it('debe verificar y decodificar un token válido', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generarToken(userId);

      const decoded = verificarToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(userId);
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });

    it('debe retornar null para un token inválido', () => {
      const tokenInvalido = 'token.invalido.123';
      const decoded = verificarToken(tokenInvalido);

      expect(decoded).toBeNull();
    });

    it('debe retornar null para un token vacío', () => {
      const decoded = verificarToken('');

      expect(decoded).toBeNull();
    });

    it('debe retornar null para un token con firma incorrecta', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generarToken(userId);
      const tokenManipulado = token.slice(0, -5) + 'xxxxx';

      const decoded = verificarToken(tokenManipulado);

      expect(decoded).toBeNull();
    });
  });
});
