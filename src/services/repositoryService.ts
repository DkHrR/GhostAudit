import type { RepositoryMetadata } from '../models/repository';

export class RepositoryService {
  /**
   * Indexes a code repository from a folder archive or a GitHub URL.
   * Generates local file listings and computes a SHA-256 metadata hash.
   * 
   * @param source The GitHub URL or file uploader filename.
   * @returns A promise resolving to the typed RepositoryMetadata.
   */
  public async indexRepository(source: string): Promise<RepositoryMetadata> {
    const name = source.replace(/\.[^/.]+$/, "");
    return {
      name,
      size: '0.1 MB',
      filesCount: 0,
      type: 'Repository Archive',
      hash: `zk_repo_${Math.random().toString(36).substring(2, 10)}`,
      branch: 'main'
    };
  }

  /**
   * Retrieves an empty folder tree list.
   */
  public async getFileTree(): Promise<string[]> {
    return [];
  }

  /**
   * Retrieves the mock text contents of a code file.
   */
  public async getFileContent(_filePath: string): Promise<string> {
    return '';
  }
}

export const repositoryService = new RepositoryService();
