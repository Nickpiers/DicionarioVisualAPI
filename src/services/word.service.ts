import { PrismaClient, Word } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateWordData {
  term: string;
  videoUrl: string;
  createdById: string;
  meanings: { description: string; example: string }[];
}

interface UpdateWordData {
  term?: string;
  videoUrl?: string;
}

export const createWord = async (data: CreateWordData) => {
  const { term, videoUrl, createdById, meanings } = data;

  const word = await prisma.word.create({
    data: {
      term,
      videoUrl,
      createdById,
      meanings: {
        create: meanings,
      },
    },
    include: {
      meanings: true, 
      createdBy: {  
        select: { id: true, name: true } 
      } 
    },
  });

  console.log(`Word created: ${word.term} by user ${createdById}`);
  return word;
};


export const getWords = async () => {
  return prisma.word.findMany({
    include: {
      meanings: true,
    },
    orderBy: {
      term: 'asc',
    },
  });
};


export const getWordById = async (id: string) => {
  return prisma.word.findUnique({
    where: { id },
    include: {
      meanings: true,
    },
  });
};


export const updateWord = async (id: string, data: UpdateWordData) => {
  const word = await prisma.word.update({
    where: { id },
    data,
    include: {
      meanings: true,
    },
  });

  console.log(`Word updated: ${word.term}`);
  return word;
};


export const deleteWord = async (id: string) => {
  const word = await prisma.word.delete({
    where: { id },
  });

  console.log(`Word deleted: ${word.term}`);
  return word;
};