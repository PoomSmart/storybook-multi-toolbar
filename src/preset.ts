export function previewAnnotations(entry: string[] = []) {
  return [...entry, require.resolve('./defaultParameters')];
}

export function managerEntries(entry: string[] = []) {
  return [...entry, require.resolve('./register')];
}
