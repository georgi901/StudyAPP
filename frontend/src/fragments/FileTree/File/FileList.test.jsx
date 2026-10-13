import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import FileList from './FileList';

afterEach(cleanup);

describe('FileList Component', () => {
  const mockFiles = [
    { id: 1, name: 'document.pdf', isOwner: true },
    { id: 2, name: 'notes.txt', isOwner: true },
    { id: 3, name: 'image.png', isOwner: true },
  ];

  it('displays the loading message', () => {
    render(<FileList selectedFolder={1} filesLoading={true} files={[]} searchFilter="" />);
    expect(screen.getByText('Loading files....')).toBeInTheDocument();
  });

  it('displays a message when the folder is empty', () => {
    render(<FileList selectedFolder={1} filesLoading={false} files={[]} searchFilter="" />);
    expect(screen.getByText('This folder is empty....')).toBeInTheDocument();
  });

  it('filters files using searchFilter', () => {
    render(
      <FileList 
        selectedFolder={1} 
        filesLoading={false} 
        files={mockFiles} 
        searchFilter="notes" 
      />
    );
    
    expect(screen.getByText('notes.txt')).toBeInTheDocument();
    expect(screen.queryByText('document.pdf')).not.toBeInTheDocument();
  });
});
