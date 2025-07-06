import React, { useState } from 'react';
import { CCard, CCardHeader, CCardBody, CButton, CListGroup, CListGroupItem } from '@coreui/react';

interface InstructionsProps {
  isVisible: boolean;
  onToggle: () => void;
}

const Instructions: React.FC<InstructionsProps> = ({ isVisible, onToggle }) => {
  return (
    <div className="instructions-container">
      <CButton 
        color="info" 
        variant="outline" 
        onClick={onToggle}
        className="instructions-toggle"
      >
        {isVisible ? 'Hide Instructions' : 'Show Instructions'}
      </CButton>
      
      {isVisible && (
        <CCard className="instructions-card">
          <CCardHeader>
            <h5>How to Use Sufusku</h5>
          </CCardHeader>
          <CCardBody>
            <CListGroup>
              <CListGroupItem>
                <strong>Entering Numbers:</strong>
                <ul>
                  <li>Click on any empty cell in the Sudoku grid</li>
                  <li>Type a number from 1-9 to fill the cell</li>
                </ul>
              </CListGroupItem>
              
              <CListGroupItem>
                <strong>Validation:</strong>
                <ul>
                  <li>The app automatically checks for duplicate numbers</li>
                  <li>Valid moves are logged in green</li>
                  <li>Invalid moves (duplicates) are logged in red</li>
                  <li>Each move is recorded with the cell position (e.g., "A1: 5")</li>
                </ul>
              </CListGroupItem>
              
              <CListGroupItem>
                <strong>Activity Log:</strong>
                <ul>
                  <li>All your moves are tracked in the activity log</li>
                  <li>Click on any log entry to restore the board to that state</li>
                  <li>Use "Drop events after" to undo all moves after a specific point</li>
                  <li>Remove individual log entries to undo specific moves</li>
                </ul>
              </CListGroupItem>
              
              <CListGroupItem>
                <strong>Control Panel:</strong>
                <ul>
                  <li><strong>Clear Board:</strong> Resets the entire board and clears all logs</li>
                  <li><strong>Freeze Board:</strong> Locks all filled cells to prevent accidental changes</li>
                  <li><strong>Solve Cell:</strong> Automatically finds the correct number for the selected cell</li>
                </ul>
              </CListGroupItem>
              
              <CListGroupItem>
                <strong>Tips:</strong>
                <ul>
                  <li>Start by filling in obvious numbers</li>
                  <li>Use the activity log to experiment with different approaches</li>
                  <li>Freeze the board when you're confident about your progress</li>
                  <li>Use the solve feature when you're stuck on a particular cell</li>
                </ul>
              </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>
      )}
    </div>
  );
};

export default Instructions; 