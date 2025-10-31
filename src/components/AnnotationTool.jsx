import { useState, useEffect, useRef } from 'react';
import './AnnotationTool.css';

const AnnotationTool = ({ 
  chartRef, 
  onAddAnnotation, 
  onRemoveAnnotation,
  annotations = []
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState(null);
  const [annotationText, setAnnotationText] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const formRef = useRef(null);
  
  useEffect(() => {
    if (!chartRef || !chartRef.current) return;
    
    const chart = chartRef.current;
    
    const handleChartClick = (e) => {
      if (!isActive) return;
      
      // Get click position relative to chart
      const rect = chart.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Set position for annotation form
      setPosition({ x, y });
      
      // Create a new annotation
      setCurrentAnnotation({
        id: Date.now(),
        x,
        y,
        text: '',
        chartWidth: rect.width,
        chartHeight: rect.height
      });
      
      // Reset text
      setAnnotationText('');
    };
    
    // Add event listener when tool is active
    if (isActive) {
      chart.addEventListener('click', handleChartClick);
      chart.classList.add('annotation-mode');
    } else {
      chart.removeEventListener('click', handleChartClick);
      chart.classList.remove('annotation-mode');
    }
    
    return () => {
      chart.removeEventListener('click', handleChartClick);
      chart.classList.remove('annotation-mode');
    };
  }, [chartRef, isActive]);
  
  const handleToggle = () => {
    setIsActive(!isActive);
    setCurrentAnnotation(null);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!currentAnnotation || !annotationText.trim()) {
      setCurrentAnnotation(null);
      return;
    }
    
    const newAnnotation = {
      ...currentAnnotation,
      text: annotationText
    };
    
    if (onAddAnnotation) {
      onAddAnnotation(newAnnotation);
    }
    
    setCurrentAnnotation(null);
    setAnnotationText('');
  };
  
  const handleCancel = () => {
    setCurrentAnnotation(null);
    setAnnotationText('');
  };
  
  const handleRemove = (id) => {
    if (onRemoveAnnotation) {
      onRemoveAnnotation(id);
    }
  };
  
  return (
    <div className="annotation-tool">
      <button 
        className={`annotation-toggle ${isActive ? 'active' : ''}`}
        onClick={handleToggle}
        title={isActive ? 'Cancel Annotation' : 'Add Annotation'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </button>
      
      {isActive && (
        <div className="annotation-status">
          Click on the chart to add an annotation
        </div>
      )}
      
      {currentAnnotation && (
        <div 
          className="annotation-form-container"
          style={{ 
            left: `${position.x}px`, 
            top: `${position.y}px` 
          }}
          ref={formRef}
        >
          <form onSubmit={handleSubmit} className="annotation-form">
            <textarea
              value={annotationText}
              onChange={(e) => setAnnotationText(e.target.value)}
              placeholder="Add your annotation here..."
              autoFocus
            />
            <div className="annotation-form-actions">
              <button type="button" onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="save-btn">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Display existing annotations */}
      {annotations.map(annotation => (
        <div 
          key={annotation.id}
          className="annotation-marker"
          style={{ 
            left: `${(annotation.x / annotation.chartWidth) * 100}%`, 
            top: `${(annotation.y / annotation.chartHeight) * 100}%` 
          }}
        >
          <div className="annotation-dot"></div>
          <div className="annotation-content">
            <p>{annotation.text}</p>
            <button 
              className="remove-annotation-btn"
              onClick={() => handleRemove(annotation.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnotationTool;
