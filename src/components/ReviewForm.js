import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = () => {
  const [reviewText, setReviewText] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);

  const handleInputChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleAnalyzeReview = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/analyze-review', { review_text: reviewText });
      setSentiment(response.data.review.sentiment);
      setKeyPoints(response.data.review.key_points);
      fetchReviews(); // Untuk memperbarui daftar review
    } catch (err) {
      setError('Terjadi kesalahan saat menganalisis review');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reviews');
      setReviews(response.data);
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data review');
    }
  };

  return (
    <div className="review-form">
      <h1>Product Review Analyzer</h1>
      <textarea
        value={reviewText}
        onChange={handleInputChange}
        placeholder="Masukkan ulasan produk..."
        rows="4"
        cols="50"
      />
      <br />
      <button onClick={handleAnalyzeReview} disabled={loading}>
        {loading ? 'Menganalisis...' : 'Analisis Ulasan'}
      </button>
      {error && <p className="error">{error}</p>}

      {sentiment && (
        <div>
          <h3>Sentimen: {sentiment}</h3>
          <h4>Poin-poin Penting: {keyPoints}</h4>
        </div>
      )}

      <h2>Daftar Review yang Telah Dianalisis</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <strong>{review.sentiment}</strong>: {review.key_points}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewForm;
