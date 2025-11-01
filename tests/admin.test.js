// tests/admin.test.js
import { jest } from '@jest/globals';

// --- Mock Prisma avant tout import ---
const prismaMock = {
  utilisateur: { findMany: jest.fn().mockResolvedValue([]) },
  offre: {
    findMany: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockImplementation((data) => Promise.resolve({ id: 2, ...data.data })),
    update: jest.fn().mockImplementation((data) => Promise.resolve({ id: data.where.id, ...data.data })),
    delete: jest.fn().mockResolvedValue({}),
  },
  commande: { findMany: jest.fn().mockResolvedValue([]) },
};

// Mock du module @prisma/client avant import du controller
jest.unstable_mockModule('@prisma/client', () => ({
  PrismaClient: jest.fn(() => prismaMock),
}));

// Import du controller après le mock
const { getDashboard, creerOffre, modifierOffre, supprimerOffre } = await import(
  '../src/controllers/admin.controller.js'
);

// Mock response
const createResMock = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};




//  test pour creerOffre
test('doit créer une offre', async () => {
  const req = {
    body: { type: 'Billet Duo', description: 'Pour deux', prix: 100 },
  };
  const res = createResMock();

  

  await creerOffre(req, res);

  expect(prismaMock.offre.create).toHaveBeenCalledWith({ data: req.body });
  expect(res.json).toHaveBeenCalledWith({ id: 2, ...req.body });

  prismaMock.offre.create.mockRejectedValueOnce(new Error('Erreur Prisma'));
});


