import type {
    BscFile,
    WalkOptions,
    WalkVisitor
} from 'brighterscript';
import {
    Range,
    Statement
} from 'brighterscript';

import { SourceNode } from 'source-map';

import type { BrsTranspileState } from 'brighterscript/dist/parser/BrsTranspileState';

export class RawCodeStatement extends Statement {
    constructor(
        public source: string,
        public sourceFile?: BscFile,
        public range: Range = Range.create(1, 1, 1, 99999)
    ) {
        super();
    }

    public clone() {
        return new RawCodeStatement(this.source, this.sourceFile, this.range);
    }

    public transpile(state: BrsTranspileState) {
        //indent every line with the current transpile indent level (except the first line, because that's pre-indented by bsc)
        let source = this.source.replace(/\r?\n/g, (match, newline) => {
            return state.newline + state.indent();
        });

        return [new SourceNode(
            this.range.start.line + 1,
            this.range.start.character,
            this.sourceFile ? this.sourceFile.pathAbsolute : state.srcPath,
            source
        )];
    }
    public walk(visitor: WalkVisitor, options: WalkOptions) {
        //nothing to walk
    }
}
