useEffect(() => {
  const showMarks = async () => {
    try {
      const studentId = localStorage.getItem("User_ID");
      if (!studentId) {
        toast.error("Instructor ID not found. Please log in again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/exams?studentId=${studentId}`
      );
      setMarks(response.data);
      console.log(marks);
    } catch (error) {
      console.log(error);
    }
  };
  showMarks();
}, []);

const [marks, setMarks] = useState([]);
