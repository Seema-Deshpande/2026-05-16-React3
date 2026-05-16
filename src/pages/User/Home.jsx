import { useEffect, useState } from "react";
import { fetchRecentThreads } from "../../services/threadService";
import ThreadList from "../../components/ThreadList/ThreadList";
import CreateThreadForm from "../../components/Forms/CreateThreadForm";
import { Container, Card } from "react-bootstrap";
import "./Home.css";

export default function Home() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadThreads = async () => {
    try {
      setLoading(true);
      const data = await fetchRecentThreads();
      console.log("Fetched threads:", data);
      setThreads(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching threads:", err);
      setError("Failed to load threads. Please try again later.");
      setLoading(false);
    };
  }

    loadThreads();
  }, []);

  const handleVoteUpdate = (threadId, newVoteCount) => {
    setThreads(
      threads.map((thread) =>
        thread._id === threadId
          ? { ...thread, voteCount: newVoteCount }
          : thread,
      ),
    );
  };

  return (
    <div className="home-wrapper">
      <Container fluid className="home-content">
        <Card className="border-0 rounded-3 shadow-sm mb-3">
          <Card.Body className="p-3 p-md-4">
            <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
              <h1
                className="fs-4 fs-md-3 fw-bold mb-0"
                style={{ color: "var(--text-dark)" }}
              >
                🏠 Home Feed
              </h1>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowForm((prev) => !prev)}
              >
                {showForm ? "x Close" : "+ Create"}
              </button>
            </div>

            {showForm && <CreateThreadForm onClose={() => setShowForm(false)} />}

            {loading ? (
              <Card.Text className="text-muted text-center py-4">
                Loading threads...
              </Card.Text>
            ) : error ? (
              <Card.Text className="text-danger text-center py-4">
                Error: {error}
              </Card.Text>
            ) : threads.length > 0 ? (
              <ThreadList threads={threads} onVoteUpdate={handleVoteUpdate} />
            ) : (
              <Card.Text className="text-muted text-center py-4">
                No threads found.
              </Card.Text>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
