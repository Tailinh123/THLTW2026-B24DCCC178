import { useState } from "react";
import { Button, Card, Space, Table, Typography } from "antd";

const { Title } = Typography;

type Choice = "Kéo" | "Búa" | "Bao";

interface History {
  player: Choice;
  computer: Choice;
  result: string;
}

const choices: Choice[] = ["Kéo", "Búa", "Bao"];

const getComputerChoice = (): Choice => {
  const index = Math.floor(Math.random() * 3);
  return choices[index];
};

const getResult = (player: Choice, computer: Choice) => {
  if (player === computer) return "Hòa";

  if (
    (player === "Kéo" && computer === "Bao") ||
    (player === "Búa" && computer === "Kéo") ||
    (player === "Bao" && computer === "Búa")
  ) {
    return "Thắng";
  }

  return "Thua";
};

const RockPaperScissors = () => {
  const [history, setHistory] = useState<History[]>([]);

  const handlePlay = (playerChoice: Choice) => {
    const computerChoice = getComputerChoice();
    const result = getResult(playerChoice, computerChoice);

    const newRound = {
      player: playerChoice,
      computer: computerChoice,
      result,
    };

    setHistory([newRound, ...history]);
  };

  const columns = [
    {
      title: "Người chơi",
      dataIndex: "player",
    },
    {
      title: "Máy",
      dataIndex: "computer",
    },
    {
      title: "Kết quả",
      dataIndex: "result",
    },
  ];

  return (
    <Card>
      <Title level={2}>Trò chơi Oẳn Tù Tì</Title>

      <Space size="large">
        <Button type="primary" onClick={() => handlePlay("Kéo")}>
          ✌ Kéo
        </Button>

        <Button type="primary" onClick={() => handlePlay("Búa")}>
          ✊ Búa
        </Button>

        <Button type="primary" onClick={() => handlePlay("Bao")}>
          ✋ Bao
        </Button>
      </Space>

      <Table
        style={{ marginTop: 30 }}
        dataSource={history}
        columns={columns}
        rowKey={(record, index) => index!.toString()}
        pagination={false}
      />
    </Card>
  );
};

export default RockPaperScissors;