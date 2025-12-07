import { Request, Response } from 'express';
import { createWord, deleteWord, getWordById, getWords, updateWord } from '../services/word.service';
import { Role } from '@prisma/client';

export const handleCreateWord = async (req: Request, res: Response) => {
  try {
    const { term, videoUrl, meanings } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User identification failed.' });
    }

    if (!term || !videoUrl || !meanings || !Array.isArray(meanings) || meanings.length === 0) {
      return res.status(400).json({ message: 'Term, videoUrl, and at least one meaning are required.' });
    }

    const newWord = await createWord({
      term,
      videoUrl,
      createdById: userId,
      meanings,
    });

    return res.status(201).json(newWord);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Word already exists.' });
    }
    console.error('Error creating word:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const handleGetWords = async (req: Request, res: Response) => {
  try {
    const words = await getWords();
    return res.status(200).json(words);
  } catch (error) {
    console.error('Error fetching words:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const handleGetWordById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const word = await getWordById(id);

    if (!word) {
      return res.status(404).json({ message: 'Word not found.' });
    }

    return res.status(200).json(word);
  } catch (error) {
    console.error('Error fetching word by ID:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const handleUpdateWord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { term, videoUrl } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const existingWord = await getWordById(id);

    if (!existingWord) {
      return res.status(404).json({ message: 'Word not found.' });
    }

    if ( userRole !== Role.ADMIN) {
      return res.status(403).json({ message: 'Forbidden: Only admin Users can delete words' });
    }

    const updatedWord = await updateWord(id, { term, videoUrl });
    return res.status(200).json(updatedWord);

  } catch (error) {
    console.error('Error updating word:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};


export const handleDeleteWord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const existingWord = await getWordById(id);

    if (!existingWord) {
      return res.status(404).json({ message: 'Word not found.' });
    }

    if ( userRole !== Role.ADMIN) {
      return res.status(403).json({ message: 'Forbidden: Only admin Users can delete words' });
    }

    await deleteWord(id);
    return res.status(204).send();

  } catch (error) {
    console.error('Error deleting word:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};