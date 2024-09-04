import MarkdownIt from 'markdown-it';

export default function headingRender(md: MarkdownIt) {
  md.block.ruler.before(
    'paragraph',
    'custom_block',
    (state, startLine, endLine, silent) => {
      const start = state.bMarks[startLine] + state.tShift[startLine];
      const max = state.eMarks[startLine];
      const marker = ':::';
      const params = state.src.slice(start, max).trim();

      if (!params.startsWith(marker)) {
        return false;
      }

      if (silent) {
        return true;
      }

      // Extract the heading level
      const match = params.match(/^:::([\s\S]*)$/);
      if (!match || !match[1]) {
        return false;
      }

      const headingInfo = match[1].trim().split(':');
      const heading = headingInfo.length > 1 ? headingInfo[1].trim() : '';

      if (!heading) {
        return false;
      }

      let nextLine = startLine;

      while (nextLine < endLine) {
        nextLine++;
        const lineText = state.src.slice(
          state.bMarks[nextLine] + state.tShift[nextLine],
          state.eMarks[nextLine]
        );

        if (lineText.trim() === ':::') {
          break;
        }
      }

      state.line = nextLine + 1;

      const token = state.push('custom_block', '', 0);
      token.content = state.getLines(startLine + 1, nextLine, 0, true);
      token.info = heading;

      return true;
    }
  );

  md.renderer.rules['custom_block'] = (tokens, idx, options, env, self) => {
    const content = tokens[idx].content;
    const heading = tokens[idx].info;

    // Render the content inside the specified heading tag
    return `<${heading}>${md.render(content)}</${heading}>\n`;
  };
}

