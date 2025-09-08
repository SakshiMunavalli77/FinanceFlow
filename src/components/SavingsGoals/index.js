import React, { useState } from "react";
import { Progress, Input, Button, List, Modal, Form } from "antd";
import "./styles.css";

function SavingsGoals({ savingsGoals, setSavingsGoals, saveSavingsGoals }) {
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [addGoalModalVisible, setAddGoalModalVisible] = useState(false);
  const [addAmountInput, setAddAmountInput] = useState({});
  const [savingIndex, setSavingIndex] = useState(null);

  const openAddGoalModal = () => {
    setNewGoalTitle("");
    setNewGoalTarget("");
    setAddGoalModalVisible(true);
  };

  const handleAddGoal = () => {
    if (!newGoalTitle.trim() || !newGoalTarget || isNaN(newGoalTarget) || newGoalTarget <= 0) {
      return;
    }
    const newGoal = {
      id: Date.now(),
      title: newGoalTitle.trim(),
      target: parseFloat(newGoalTarget),
      saved: 0,
    };
    const updatedGoals = [...savingsGoals, newGoal];
    setSavingsGoals(updatedGoals);
    saveSavingsGoals(updatedGoals);
    setAddGoalModalVisible(false);
  };

  const openAddAmountInput = (index) => {
    setSavingIndex(index);
    setAddAmountInput({ [index]: "" });
  };

  const handleAmountChange = (e, index) => {
    setAddAmountInput({ ...addAmountInput, [index]: e.target.value });
  };

  const handleAddAmount = (index) => {
    const value = parseFloat(addAmountInput[index]);
    if (isNaN(value) || value <= 0) return;
    const updatedGoals = savingsGoals.map((goal, i) => {
      if (i === index) {
        const newSaved = goal.saved + value;
        return {
          ...goal,
          saved: newSaved > goal.target ? goal.target : newSaved,
        };
      }
      return goal;
    });
    setSavingsGoals(updatedGoals);
    saveSavingsGoals(updatedGoals);
    setAddAmountInput({ [index]: "" });
    setSavingIndex(null);
  };

  return (
    <div className="savings-goals-card">
      <h3 className="savings-goals-title"> Savings Goals</h3>

      <List
        dataSource={savingsGoals}
        locale={{ emptyText: "No savings goals added yet." }}
        renderItem={(goal, index) => {
          const progressPercent = Math.min((goal.saved / goal.target) * 100, 100);
          return (
            <List.Item
              key={goal.id}
              className="savings-goal-item"
              actions={[
                savingIndex === index ? (
                  <>
                    <Input
                      className="add-amount-input"
                      type="number"
                      value={addAmountInput[index] || ""}
                      onChange={(e) => handleAmountChange(e, index)}
                      placeholder="Add amount"
                      min={0}
                    />
                    <Button type="primary" onClick={() => handleAddAmount(index)}>
                      Save
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => openAddAmountInput(index)} className="add-savings-btn">
                    Add Savings
                  </Button>
                ),
              ]}
            >
              <List.Item.Meta
                title={<span className="goal-title">{goal.title}</span>}
                description={
                  <>
                    <p className="goal-summary">
                      Goal: ₹{goal.target.toLocaleString()} &nbsp;|&nbsp; Saved: ₹{goal.saved.toLocaleString()}
                    </p>
                    <Progress percent={progressPercent} status={progressPercent >= 100 ? "success" : "active"} />
                  </>
                }
              />
            </List.Item>
          );
        }}
      />

      <Button type="dashed" block className="add-goal-btn" onClick={openAddGoalModal}>
        + Add New Savings Goal
      </Button>

      <Modal
        title="Add New Savings Goal"
        visible={addGoalModalVisible}
        onOk={handleAddGoal}
        onCancel={() => setAddGoalModalVisible(false)}
        okText="Add Goal"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          <Form.Item label="Goal Title" required>
            <Input
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              placeholder="e.g., Emergency Fund"
            />
          </Form.Item>
          <Form.Item label="Target Amount (₹)" required>
            <Input
              type="number"
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
              placeholder="e.g., 10000"
              min={1}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default SavingsGoals;
