/**
 * Selects a port in the Ephemeral range by deterministically hashing a string
 * name. That is, for any given name, the returned port number is:
 *
 * 1. in the Ephemeral range,
 * 2. always returned for the given name, and
 * 3. unlikely in practice to be returned for any other name.
 *
 * @param name The name to use to select a port
 * @returns The selected port number
 */
export default (name: string) => {
  const rangeOffset = 49151;
  const rangeEnd = 65535;
  const rangeLength = rangeEnd - rangeOffset;

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash + char) % rangeLength;
  }
  return hash + rangeOffset;
};
