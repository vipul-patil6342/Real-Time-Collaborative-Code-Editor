import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRoom } from "../features/room/room.thunk";
import { useNavigate } from "react-router-dom";

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { roomId, loading, error } = useSelector((state) => state.room);

    const handleCreateRoom = () => {
        dispatch(createRoom());
    };

    useEffect(() => {
        if (roomId) {
            navigate(`/editor/${roomId}`);
        }
    }, [roomId, navigate, dispatch]);

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-4">
            <h1 className="text-3xl font-bold">Collaborative Code Editor</h1>

            <button
                onClick={handleCreateRoom}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
            >
                {loading ? "Creating..." : "Create Room"}
            </button>

            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}

export default Home;
