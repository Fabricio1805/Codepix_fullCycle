package kafka

import (
	"fmt"
	"os"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/jinzhu/gorm"

	"github.com/Fabricio1805/imersaoFullCycle/codePix-go/application/factory"
	appmodel "github.com/Fabricio1805/imersaoFullCycle/codePix-go/application/model"
	"github.com/Fabricio1805/imersaoFullCycle/codePix-go/application/usecase"
	"github.com/Fabricio1805/imersaoFullCycle/codePix-go/domain/model"
)

type KafkaProcessor struct {
	Database *gorm.DB
	Producer *ckafka.Producer
	DeliveryChan chan ckafka.Event
}

func NewKafkaProcessor(database *gorm.DB, producer *ckafka.Producer, deliveryChan chan ckafka.Event) *KafkaProcessor { 
	return &KafkaProcessor{
		Database: database,
		Producer: producer,
		DeliveryChan: deliveryChan,
	}
}

func (k *KafkaProcessor) Consume(){
	configMap := &ckafka.ConfigMap{
		"bootstrap.servers": os.Getenv("kafkaBootstrapServers"),
		"group.id": os.Getenv("kafkaConsumerGroupId"),
		"auto.offset.reset": "earliest",
	}
	c, err := ckafka.NewConsumer(configMap)

	if err != nil {
		panic(err)
	}

	topics := []string{os.Getenv("kafkaTransactionTopic"), os.Getenv("kafkaTransactionConfirmationTopic")}
	c.SubscribeTopics(topics, nil)


	fmt.Println("kafka consumer has been started")
	for {
		msg, err := c.ReadMessage(-1)
		if err == nil {
			k.processMessage(msg)
			fmt.Println(string(msg.Value))
		}
	}
}

func (k *KafkaProcessor) processMessage(msg *ckafka.Message) {
	transactionsTopic := "transactions"
	transactionConfirmationTopic := "transaction_confirmation"

	switch topic := *msg.TopicPartition.Topic; topic {
	case transactionsTopic:
		k.processTransaction(msg)
	case	transactionConfirmationTopic:
		k.processTransactionConfirmation(msg)
	default: 
	fmt.Println("not a valid topic", string(msg.Value))
	
	}
}

func (k *KafkaProcessor) processTransaction(msg *ckafka.Message) error {
	trnsaction := appmodel.NewTransaction()
	err := trnsaction.ParseJson(msg.Value)
	if err != nil {
		return err
	}

	transactionUseCase := factory.TransactionUseCaseFactory(k.Database)

	createdTransaction, err := transactionUseCase.Register(
		trnsaction.AccountID,
		trnsaction.Amount,
		trnsaction.PixKeyTo,
		trnsaction.PixkeyKindTo,
		trnsaction.Description,
	)

	if err != nil {
		fmt.Println("error registering transaction ", err)
		return err
	}

	topic := "bank"+createdTransaction.PixKeyTo.Account.Bank.Code
	trnsaction.ID = createdTransaction.ID
	trnsaction.Status = model.TransactionPending

	transactionJson, err := trnsaction.ToJson()
	if err != nil {
		return err
	}

	err = Publish(string(transactionJson), topic, k.Producer, k.DeliveryChan)
	if err != nil { 
		return err
	}

	return nil
}

func (k *KafkaProcessor) processTransactionConfirmation(msg *ckafka.Message) error {
	trnsaction := appmodel.NewTransaction()
	err := trnsaction.ParseJson(msg.Value)
	if err != nil {
		return err
	}

	transactionUseCase := factory.TransactionUseCaseFactory(k.Database)

	if trnsaction.Status == model.TransactionConfirmed {
		err = k.confirmTranction(trnsaction, transactionUseCase)
		if err != nil {
			return err
		}
	}else if trnsaction.Status == model.TransactionCompleted {
		_, err = transactionUseCase.Complete(trnsaction.ID)
		if err != nil {
			return err
		}
		return nil
	}
	return nil
}


func (k *KafkaProcessor) confirmTranction(transaction *appmodel.Transaction, transactionUsecase usecase.TransactionUseCase) error {
	confirmedTransaction, err := transactionUsecase.Confirm(transaction.ID)

	if err != nil {
		return err
	}

	topic := "bank" + confirmedTransaction.AccountFrom.Bank.Code

	trnsactionJson, err := transaction.ToJson()

	if err != nil {
		return err
	}

	err = Publish(string(trnsactionJson), topic, k.Producer, k.DeliveryChan)
	if err != nil {
		return err
	}


	return nil
}