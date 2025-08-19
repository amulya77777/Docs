import Editor from "./editor";
import {Toolbar} from "./Toolbar"

interface DocumentsIdProps {
  params: Promise<{ documentId: string }>;
}

const DocumentsIdPage = async ({ params }: DocumentsIdProps) => {
  const { documentId } = await params;

  return (
    <div className="min-h-screen bg-#fafbfd ">
      <Toolbar />
      <Editor />
    </div>
  );
};

export default DocumentsIdPage;
