export const generateCategoryEm = (title: string | undefined) => {
  if (!title) {
    return '';
  }
  return title.replace('[[', '<em>').replace(']]', '</em>');
};
